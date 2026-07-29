# ============================================================
#  RAM 상한 dev 서버 실행기 (Next.js Turbopack 워커 누수 방지)
#  사용: powershell -ExecutionPolicy Bypass -File scripts\dev-capped.ps1
#        옵션: -LimitGB 6 -MaxNewProcs 50 -PollSec 3
#
#  동작: dev 서버가 "새로 띄운 node"만 감시. 총 RAM > LimitGB 이거나
#        새 node 수 > MaxNewProcs 이면 dev 트리를 즉시 종료(폭주 차단).
#        기존 VS Code / Claude / MCP node는 기준선(baseline)으로 제외 → 안 건드림.
# ============================================================
param(
  [double]$LimitGB = 16,     # dev 서버 트리 총 RAM 상한(GB). 64GB 중 16GB=여유 48GB, 정상 dev(1~2GB)엔 안 걸림
  [int]$MaxNewProcs = 200,   # 16GB 상한에 맞춤(워커 1개 ~80MB × 200 ≈ 16GB). 커밋도 ~11GB로 안전. RAM 상한과 거의 같은 지점에서 차단
  [int]$PollSec = 3,         # 감시 주기(초)
  [string]$DevCmd = "npm run dev"  # 실행할 dev 명령 (예: "npm run dev -- --webpack" 으로 webpack 사용)
)
$ErrorActionPreference = "SilentlyContinue"

# 1) 기준선: dev 시작 전 존재하는 node PID(=VS Code/Claude/MCP 등, 보호 대상)
$baseline = @{}
Get-Process node | ForEach-Object { $baseline[$_.Id] = $true }
Write-Host ("[cap] 보호 대상(기존) node: {0}개 · 상한 {1}GB / 신규 {2}개 / {3}초 주기" -f $baseline.Count, $LimitGB, $MaxNewProcs, $PollSec) -ForegroundColor Cyan

# 2) 추가 안전장치: node 프로세스당 힙 상한 4GB
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# 3) dev 서버 기동 (cmd 래퍼는 먼저 종료될 수 있으므로 핸들에 의존하지 않음)
Start-Process cmd -ArgumentList '/c', $DevCmd -WindowStyle Minimized
Write-Host ("[cap] dev 서버 기동 중 ({0}) → http://localhost:3000  (중지: 이 창에서 Ctrl+C)" -f $DevCmd) -ForegroundColor Green

function Get-DevNodes { Get-Process node | Where-Object { -not $baseline[$_.Id] } }
function Port3000 { [bool](Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue) }

# 4) 감시 루프 — 실제 dev node/포트로 추적. 시작 60초는 컴파일 유예(node 0이어도 안 끊음)
$start = Get-Date
try {
  while ($true) {
    Start-Sleep -Seconds $PollSec
    $dev = @(Get-DevNodes)
    $ramGB = [math]::Round((($dev | Measure-Object WorkingSet64 -Sum).Sum) / 1GB, 2)
    $cnt = $dev.Count
    $elapsed = ((Get-Date) - $start).TotalSeconds
    # 서버가 정말 끝났는지: 유예 후 node도 0이고 포트도 닫혀 있으면 종료
    if ($elapsed -gt 60 -and $cnt -eq 0 -and -not (Port3000)) { Write-Host "[cap] dev 서버 종료 감지 — 감시 종료" -ForegroundColor Cyan; break }
    $over = ($ramGB -gt $LimitGB) -or ($cnt -gt $MaxNewProcs)
    Write-Host ("[cap] dev node {0}개 · {1}GB · 포트{2} {3}" -f $cnt, $ramGB, $(if (Port3000) { "O" } else { "-" }), $(if ($over) { "← 상한 초과!" } else { "OK" }))
    if ($over) {
      Write-Host ("⚠️ [cap] 상한 초과 (RAM {0}GB / {1}개) — dev 서버 트리 즉시 종료" -f $ramGB, $cnt) -ForegroundColor Red
      $dev | ForEach-Object { Stop-Process -Id $_.Id -Force }   # 신규 node만 종료(기존 보호)
      break
    }
  }
} finally {
  # 종료 시 dev 서버가 띄운 신규 node 정리(고아 워커 방지) — 기존 node는 보존
  @(Get-DevNodes) | ForEach-Object { Stop-Process -Id $_.Id -Force }
  Write-Host "[cap] 정리 완료 — dev 서버 신규 node 종료, 기존(VS Code/Claude/MCP) 유지" -ForegroundColor Cyan
}
