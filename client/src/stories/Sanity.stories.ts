import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta = {
    title: "Sandbox/SmokeTest",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => ({
        template: `
      <div style="padding: 2rem; font-family: sans-serif;">
        <h1> Storybook Smoke Test</h1>
        <p>Please render.</p>
      </div>
    `,
    }),
};
