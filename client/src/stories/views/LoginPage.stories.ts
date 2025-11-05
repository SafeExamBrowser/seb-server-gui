import { Meta, StoryObj } from "@storybook/vue3";
import LoginPage from "@/components/views/LoginPage.vue";

const meta: Meta<typeof LoginPage> = {
    title: "Views/LoginPage",
    component: LoginPage,
    parameters: {
        layout: "fullscreen",
    },
};
export default meta;

type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
    args: {},
};
