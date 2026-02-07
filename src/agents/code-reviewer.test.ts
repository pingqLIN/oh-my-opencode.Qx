import { describe, test, expect } from "bun:test"
import { createCodeReviewerAgent, CODE_REVIEWER_PROMPT_METADATA } from "./code-reviewer"

describe("code-reviewer agent", () => {
  describe("basic configuration", () => {
    test("should use correct model and temperature", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.model).toBe(model)
      expect(agent.temperature).toBe(0.1)
    })

    test("should use subagent mode", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.mode).toBe("subagent")
    })

    test("should set maxTokens to 4000", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.maxTokens).toBe(4000)
    })

    test("should have comprehensive description", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.description).toContain("Post-implementation")
      expect(agent.description).toContain("two-phase")
      expect(agent.description).toContain("Gate Check")
      expect(agent.description).toContain("Quality Assessment")
      expect(agent.description).toContain("plan adherence")
      expect(agent.description).toContain("code quality")
      expect(agent.description).toContain("security")
      expect(agent.description).toContain("SOLID")
      expect(agent.description).toContain("test coverage")
    })
  })

  describe("tool restrictions", () => {
    test("should block write tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission).toBeDefined()
      expect(permission!.write).toBe("deny")
    })

    test("should block edit tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission).toBeDefined()
      expect(permission!.edit).toBe("deny")
    })

    test("should block task tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission).toBeDefined()
      expect(permission!.task).toBe("deny")
    })

    test("should block call_omo_agent tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission).toBeDefined()
      expect(permission!.call_omo_agent).toBe("deny")
    })

    test("should allow read tool (by not being in permission deny list)", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission?.read).not.toBe("deny")
    })

    test("should allow safe_grep tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission?.safe_grep).not.toBe("deny")
    })

    test("should allow lsp_find_references tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission?.lsp_find_references).not.toBe("deny")
    })

    test("should allow ast_grep_search tool", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const permission = agent.permission as Record<string, string> | undefined
      expect(permission?.ast_grep_search).not.toBe("deny")
    })
  })

  describe("model-specific configuration", () => {
    test("should configure extended thinking for Claude models", () => {
      //#given
      const claudeModel = "anthropic/claude-opus-4-6"

      //#when
      const agent = createCodeReviewerAgent(claudeModel)

      //#then
      expect(agent.thinking).toBeDefined()
      expect(agent.thinking?.type).toBe("enabled")
      expect(agent.thinking?.budgetTokens).toBe(32000)
    })

    test("should configure reasoningEffort for GPT models", () => {
      //#given
      const gptModel = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(gptModel)

      //#then
      expect(agent.reasoningEffort).toBe("high")
    })

    test("should configure textVerbosity for GPT models", () => {
      //#given
      const gptModel = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(gptModel)

      //#then
      expect(agent.textVerbosity).toBe("high")
    })

    test("should not have thinking config for GPT models", () => {
      //#given
      const gptModel = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(gptModel)

      //#then
      expect(agent.thinking).toBeUndefined()
    })

    test("should not have reasoningEffort for Claude models", () => {
      //#given
      const claudeModel = "anthropic/claude-opus-4-6"

      //#when
      const agent = createCodeReviewerAgent(claudeModel)

      //#then
      expect(agent.reasoningEffort).toBeUndefined()
    })
  })

  describe("prompt metadata", () => {
    test("should have advisor category", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.category).toBe("advisor")
    })

    test("should be marked as expensive", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.cost).toBe("EXPENSIVE")
    })

    test("should have Code Reviewer as prompt alias", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.promptAlias).toBe("Code Reviewer")
    })

    test("should have exactly 3 triggers", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.triggers).toHaveLength(3)
    })

    test("should have triggers covering key domains", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA
      const domains = metadata.triggers.map(t => t.domain)

      //#then
      expect(domains).toContain("Implementation complete")
      expect(domains).toContain("Pre-merge review")
      expect(domains).toContain("Quality gate")
    })

    test("should have useWhen array with at least 5 items", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.useWhen).toBeDefined()
      expect(metadata.useWhen!.length).toBeGreaterThanOrEqual(5)
    })

    test("should have avoidWhen array with at least 5 items", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA

      //#then
      expect(metadata.avoidWhen).toBeDefined()
      expect(metadata.avoidWhen!.length).toBeGreaterThanOrEqual(5)
    })

    test("should include key use cases in useWhen", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA
      const useWhenStr = metadata.useWhen!.join(" ")

      //#then
      expect(useWhenStr).toMatch(/implementation.*complete/i)
      expect(useWhenStr).toMatch(/pull request/i)
      expect(useWhenStr).toMatch(/plan adherence/i)
    })

    test("should include key anti-patterns in avoidWhen", () => {
      //#given //#when
      const metadata = CODE_REVIEWER_PROMPT_METADATA
      const avoidWhenStr = metadata.avoidWhen!.join(" ")

      //#then
      expect(avoidWhenStr).toMatch(/active development/i)
      expect(avoidWhenStr).toMatch(/work in progress/i)
    })
  })

  describe("prompt content validation", () => {
    test("should contain critical_first_rule section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<critical_first_rule>")
      expect(agent.prompt).toContain("</critical_first_rule>")
    })

    test("should contain review_framework section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<review_framework>")
      expect(agent.prompt).toContain("</review_framework>")
    })

    test("should contain output_format section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<output_format>")
      expect(agent.prompt).toContain("</output_format>")
    })

    test("should contain defensive_constraints section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<defensive_constraints>")
      expect(agent.prompt).toContain("</defensive_constraints>")
    })

    test("should contain tool_strategy section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<tool_strategy>")
      expect(agent.prompt).toContain("</tool_strategy>")
    })

    test("should contain communication_protocol section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<communication_protocol>")
      expect(agent.prompt).toContain("</communication_protocol>")
    })

    test("should contain examples section", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("<examples>")
      expect(agent.prompt).toContain("</examples>")
    })

    test("should describe Phase 1 Gate Check", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("Phase 1")
      expect(agent.prompt).toContain("Gate Check")
    })

    test("should describe Phase 2 Quality Assessment", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("Phase 2")
      expect(agent.prompt).toContain("Quality Assessment")
    })

    test("should mention SOLID principles", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toContain("SOLID")
    })

    test("should mention approval bias", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      expect(agent.prompt).toMatch(/approval bias/i)
    })

    test("should include at least 2 examples", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      // Count occurrences of "Example" in the examples section
      const examplesSection = agent.prompt!.split("<examples>")[1]?.split("</examples>")[0] || ""
      const exampleMatches = examplesSection.match(/\*\*Example \d+:/g)
      expect(exampleMatches).toBeDefined()
      expect(exampleMatches!.length).toBeGreaterThanOrEqual(2)
    })

    test("should include file:line references in examples", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const examplesSection = agent.prompt!.split("<examples>")[1]?.split("</examples>")[0] || ""
      // Look for patterns like "users.ts:45" or "login.ts:23"
      expect(examplesSection).toMatch(/\w+\.ts:\d+/)
    })

    test("should mention input validation in critical_first_rule", () => {
      //#given
      const model = "openai/gpt-5.2"

      //#when
      const agent = createCodeReviewerAgent(model)

      //#then
      const criticalSection = agent.prompt!.split("<critical_first_rule>")[1]?.split("</critical_first_rule>")[0] || ""
      expect(criticalSection).toContain(".sisyphus/plans/")
      expect(criticalSection).toContain("read")
      expect(criticalSection).toMatch(/verify|validate/)
    })
  })
})
