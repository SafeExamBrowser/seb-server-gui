// The generic backend EntityController exposes the same row-action endpoints for
// every entityable domain: DELETE `<base>/<id>`, POST `<base>/<id>/active` and
// `<base>/<id>/inactive`. Each domain builds its matchers from its own base path.
export const entityRowActionRequests = (base: string) => ({
    delete: (id: string | number) => new RegExp(`${base}/${id}(?:$|\\?)`, "i"),
    activate: (id: string | number) =>
        new RegExp(`${base}/${id}/active(?:$|\\?)`, "i"),
    deactivate: (id: string | number) =>
        new RegExp(`${base}/${id}/inactive(?:$|\\?)`, "i"),
});
