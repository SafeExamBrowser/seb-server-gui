import {
    AbilityBuilder,
    AbilityClass,
    Ability,
    PureAbility,
    createAliasResolver,
    MongoQuery,
} from '@casl/ability'
import { UserRoleEnum } from '@/models/userRoleEnum'

export type Actions = 'view' | 'manage' | 'edit' | 'read'
export type Subjects = 'NavigationOverview' | 'UserAccount' | 'all'

export type AppAbility = PureAbility<[Actions, Subjects], MongoQuery>

const AppAbilityClass = Ability as AbilityClass<AppAbility>

export const ability = new AppAbilityClass([], {
    resolveAction: createAliasResolver({ update: 'edit' }),
})

export function defineRulesForRoles(userRoles: string[]) {
    console.log('Defining rules for roles:', userRoles)

    const { can, cannot, build } = new AbilityBuilder<AppAbility>(AppAbilityClass)


    //NavigationOverview
    if (
        userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN) ||
        userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN)
    ) {
        can('view', 'NavigationOverview')
    }

    return build()
}
