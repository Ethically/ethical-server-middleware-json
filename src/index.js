const jsonMiddleware = async (ctx, next) => {
    if (!ctx.request.is('application/json')) return await next()
    ctx.request.body = JSON.parse(ctx.request.body)
    await next()
}

const jsonMiddlewareInit = (config) => (
    async (ctx, next) => await jsonMiddleware(ctx, next, config)
)

export default jsonMiddlewareInit
