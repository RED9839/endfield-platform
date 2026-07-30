import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  nextVitals,
  nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // 전투 뷰는 DDState 전체를 stateRef에 담고 useReducer 강제 리렌더로 그리는
    // mutable 게임 루프다. 렌더 중 stateRef.current 참조가 설계 그 자체라
    // 이 파일에서만 refs 룰을 끈다. 상태 모델을 다시 짜기 전까진 유지.
    files: ["app/game/dd/ui/BattleView.tsx"],
    rules: { "react-hooks/refs": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
