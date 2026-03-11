import type { Meta, StoryObj } from "@storybook/vue3";
import LoginPage from "@/components/views/login/LoginPage.vue";

const meta: Meta<typeof LoginPage> = {
    title: "Components/Views/LoginPage",
    component: LoginPage,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => ({
        components: { LoginPage },
        setup() {
            return { args };
        },
        template: '<LoginPage v-bind="args" />',
    }),
};
