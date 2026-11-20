# Style Guider

## 1. UI/UX Design Principles

- Remove redundant slogans, explanatory text, decorative copy, and secondary labels that do not help users complete tasks.
- If removing these elements makes the interface difficult to understand, redesign the layout, visual hierarchy, or interaction flow instead of adding explanatory text back.
- Keep interfaces clean, intuitive, and self-explanatory. Preserve essential labels, accessibility information, and actionable feedback.

## 2. Change Quality Principles

- Every change must consider and improve three dimensions:
  - **User Experience (UX):** Make the product clearer, easier to use, and more efficient.
  - **Developer Experience (DX):** Keep the code understandable, maintainable, and easy to extend.
  - **AI Agent Experience (AX):** Keep the codebase, conventions, and interfaces explicit, consistent, and easy for AI Agents to understand and modify.
- Preserve existing functionality and behavior unless a change is explicitly required.
- Avoid improvements in one dimension that introduce regressions in another.
- Prefer the simplest implementation that satisfies all three dimensions without introducing unnecessary complexity.

## 3. Code Design Principles

- Keep things in one function unless composable or reusable.
- Validate unknown values once at the boundary that owns them. Pass typed values inward instead of repeating `typeof value === "object"` and property-existence checks. Do not defensively revalidate values already guaranteed by a schema, constructor, or internal type.
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Before adding complexity for a speculative or vanishingly unlikely race or security edge case, explain the concrete failure mode, likelihood, and complexity cost to the user and get their buy-in. Do not silently expand scope for theoretical robustness.

## 4. 构建与验证

- **改动后打包生效**：本项目为 Chrome 扩展，代码改动后需执行构建打包（`npm run build`），确保编译产物同步生效至 `dist/` 目录供浏览器直接加载。
- **验证边界**：
  - 测试仅限本次改动相关范围，不擅自扩展为全量测试，不修复无关失败。
  - 未运行全量测试时，交付中如实说明。
