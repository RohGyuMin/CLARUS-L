@AGENTS.md

## 하네스: Freelance Delivery

**목표:** 외주/계약 개발 작업에서 구현 완료 후 클라이언트에게 넘기기 전에 `review-work` 중심의 납품 전 검수를 거치게 한다.

**트리거:** 외주/계약 개발 맥락에서 구현이 끝났거나 handoff 직전이고, 사용자가 "전달 전 검토", "납품 전 확인", "final review", "ready to deliver", "handoff" 같은 요청을 하면 `freelance-delivery` 스킬을 사용하라. 또한 외주/계약 맥락에서 **당신이 구현 완료로 판단하고 handoff 요약이나 전달 문구를 작성하려는 시점**에도, 먼저 납품 전 검수(`freelance-delivery`) 실행을 제안하고 사용자가 거부하면 리스크만 짧게 고지한 뒤 진행하라. 단순 질문, 초기 기획, 구현 진행 중 작업에는 트리거하지 않는다. 사용자가 명시적으로 검수를 생략하라고 하면 따르되 리스크를 짧게 알린다.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-13 | 초기 freelance delivery 하네스 등록 | `.claude/skills/freelance-delivery/SKILL.md`, `.claude/agents/freelance-delivery-reviewer.md` | 외주 납품 전 `review-work` 기반 검수 게이트 추가 |
