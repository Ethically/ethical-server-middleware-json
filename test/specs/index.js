import curl from 'curl'
import ethicalServer from 'ethical-utility-server'
import postDataMiddleware from 'ethical-server-middleware-post-data'
import jsonMiddleware from '../../src/index.js'

const postServer = (
        data = '',
        type = 'application/json',
        url = 'http://localhost:8080'
    ) => {
    return new Promise((resolve, reject) => {
        curl.post(url, data, {
            headers: {
                'content-type': type
            }
        }, (err, response, body) => {
            if (err) reject(err)
            const status = response.statusCode
            const port = parseInt(response.request.port)
            resolve({ body, status, port })
        })
    })
}

const removeServer = destroyServer => {
    return destroyServer()
}

describe('jsonMiddleware()', () => {
    it('should parse JSON data', (done) => {
		const object = { hello: 'world!' }
        const string = JSON.stringify(object)
        const server = ethicalServer()
            .use(postDataMiddleware())
            .use(jsonMiddleware())
            .use((ctx, next) => {
				expect(ctx.request.body).toEqual(object)
				ctx.response.body = string
			})
			.listen()
			.then(destroyServer => {
	            return postServer(string).then(({ body, status, port }) => {
	                expect(body).toEqual(string)
	                expect(status).toBe(200)
	                return destroyServer
	            })
	        })
			.then(removeServer)
            .then(done)
			.catch(e => console.error(e.stack || e))
    })
    it('should ignore post data', (done) => {
		const string = 'Not JSON!'
        const server = ethicalServer()
            .use(postDataMiddleware())
            .use(jsonMiddleware())
            .use((ctx) => {
                ctx.response.body = ctx.request.body
            })
			.listen()
			.then(destroyServer => {
	            return postServer(string, 'text/html')
                    .then(({ body, status, port }) => {
    	                expect(body).toEqual(string)
    	                expect(status).toBe(200)
    	                return destroyServer
    	            })
	        })
			.then(removeServer)
            .then(done)
			.catch(e => console.error(e.stack || e))
    })
})
