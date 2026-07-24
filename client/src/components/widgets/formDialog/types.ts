import type { BackendErrorForm } from "@/services/errors/formErrorMapping.ts";

// A submit handler either reports an outcome — `false` keeps the dialog open after a
// failure it already surfaced itself (backend field errors applied via `form`, toast) —
// or returns nothing and signals failure by throwing, which the dialog shows in its
// error alert.
export type FormDialogSubmitHandler<TTransient> =
    | ((
          item: TTransient,
          form?: BackendErrorForm,
      ) => boolean | Promise<boolean>)
    | ((item: TTransient, form?: BackendErrorForm) => void | Promise<void>);
