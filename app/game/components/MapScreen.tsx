          {operator.className} / {operator.role}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <span className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black text-white">
            ATK {operator.attack}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black text-white">
            SPD {operator.speed}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black text-white">
            HP {operator.maxHp}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function MapScreen({
  availableNodes,
  visitedNodes,
  onEnter,
}: {
  availableNodes: string[];
  visitedNodes: string[];
  onEnter: (nodeId: string) => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(availableNodes[0] ?? mapNodes[0]?.id);
  const selectedNode =
    mapNodes.find((node) => node.id === selectedNodeId && availableNodes.includes(node.id)) ??
    mapNodes.find((node) => availableNodes.includes(node.id)) ??
    mapNodes[0];
  const visual = nodeVisual[selectedNode.type];
  const Icon = visual.icon;
  const enemies = useMemo(
    () => getEnemies(selectedNode.enemyIds ?? []).slice(0, 3),
    [selectedNode.enemyIds],
  );
  const rewards = useMemo(
    () => chooseGearRewards(visitedNodes.length + 1, 4, selectedNode.rewardTier ?? "early").map(getGameGear),
    [selectedNode.rewardTier, visitedNodes.length],
  );

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_24%_18%,rgba(226,232,240,0.32),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(124,58,237,0.32),transparent_34%),linear-gradient(110deg,#e8edf2_0%,#d6dce5_36%,#151324_68%,#07060c_100%)] px-4 py-6 text-white sm:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:54px_54px] opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/65 to-transparent" />

      <div className="relative mx-auto grid max-w-[1800px] gap-6 xl:grid-cols-[minmax(0,1fr)_590px]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.36em] text-zinc-800/55">
                ENDFIELD FIELD OPERATION
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
                전술 편성
              </h1>
            </div>
            <div className="hidden rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-black text-zinc-800 shadow-sm backdrop-blur md:block">
              PARTY 04 / READY
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {startingParty.map((operator, index) => (
              <OperatorCard key={operator.id} operator={operator} index={index} />
            ))}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0b0817]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(139,92,246,0.28),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.32em] text-violet-200/50">
                  OPERATION SELECT
                </p>
                <h2 className="mt-2 text-4xl font-black text-white">{selectedNode.title}</h2>
                <p className="mt-2 text-sm font-bold text-violet-100/55">{selectedNode.subtitle}</p>
              </div>
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.color} shadow-lg`}>
                <Icon className="h-7 w-7 text-white" />
              </span>
            </div>

            <div className="mt-8 border-y border-white/10 py-4">
              <p className="mb-1 text-center text-sm font-black text-white/70">난이도</p>
              <div className="flex items-center justify-center gap-6">
                {difficultyMarks(visual.difficulty)}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {availableNodes.map((nodeId) => {
                const node = mapNodes.find((item) => item.id === nodeId);
                if (!node) return null;
                const nodeInfo = nodeVisual[node.type];
                const NodeIcon = nodeInfo.icon;
                const active = node.id === selectedNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-violet-300/45 bg-violet-300/16 text-white"
                        : "border-white/8 bg-white/[0.045] text-violet-100/70 hover:border-white/20 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${nodeInfo.color}`}>
                        <NodeIcon className="h-5 w-5 text-white" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black">{node.title}</span>
                        <span className="block text-[10px] font-bold tracking-[0.18em] text-white/35">
                          {nodeInfo.label} / F{node.floor}
                        </span>
                      </span>
                    </span>
                    <ArrowRight className={`h-4 w-4 ${active ? "text-orange-300" : "text-white/25"}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.045] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black text-white/70">등장 몬스터</p>
                <Search className="h-5 w-5 text-white/45" />
              </div>
              <div className="flex gap-3">
                {enemies.length > 0 ? (
                  enemies.map((enemy) => (
                    <div key={enemy.id} className="relative h-24 w-24 overflow-hidden rounded-xl border border-red-300/25 bg-black/35">
                      {enemy.image && (
                        <Image src={enemy.image} alt="" fill sizes="96px" className="object-contain p-2" />
                      )}
                      <span className="absolute left-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-black">
                        {enemy.boss ? "BOSS" : enemy.elite ? "EL" : "EN"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-bold text-white/45">비전투 구역</p>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.045] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black text-white/70">획득 가능 전리품</p>
                <BadgeInfo className="h-5 w-5 text-white/45" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {rewards.map((gear) => (
                  <div key={gear.slug} className="relative h-20 overflow-hidden rounded-xl border border-yellow-200/15 bg-gradient-to-br from-yellow-200/18 to-violet-400/10">
                    <Image src={gear.image} alt="" fill sizes="80px" className="object-contain p-2" />
                    <span className="absolute left-1 top-1 rounded bg-white px-1.5 py-0.5 text-[8px] font-black text-zinc-900">
                      Q{gear.quality}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEnter(selectedNode.id)}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-zinc-950 via-violet-900 to-fuchsia-500 px-6 py-5 text-xl font-black text-white shadow-[0_18px_45px_rgba(168,85,247,0.3)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              진입
              <ArrowRight className="h-6 w-6" />
            </button>

            <p className="mt-4 text-center text-[11px] font-bold text-white/35">
              CLEARED {visitedNodes.length} / ROUTE {mapNodes.length}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
