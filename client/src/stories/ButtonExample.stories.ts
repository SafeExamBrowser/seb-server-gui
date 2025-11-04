import type { Meta, StoryObj } from "@storybook/vue3";
import ButtonExample from "../components/ButtonExample.vue";

const meta: Meta<typeof ButtonExample> = {
    title: "Example/ButtonExample",
    component: ButtonExample,
    args: { label: "Hello" },
};
export default meta;

type Story = StoryObj<typeof ButtonExample>;

export const Primary: Story = {
    args: { label: "Hello" },
};
