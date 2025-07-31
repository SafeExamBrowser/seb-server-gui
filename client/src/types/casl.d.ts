import { AppAbility } from '@/casl/ability'

declare module 'vue' {
    interface ComponentCustomProperties {
        $can: AppAbility['can']
    }
}
