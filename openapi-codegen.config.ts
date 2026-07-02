import {
    generateSchemaTypes,
    generateReactQueryComponents,
} from '@openapi-codegen/typescript'
import { defineConfig } from '@openapi-codegen/cli'
export default defineConfig({
    adminApi: {
        // from: {
        //     relativePath: './src/openapi.json',
        //     source: 'file',
        // },
        from: {
            source: 'url',
            url: 'https://backend-staging.135.181.238.146.sslip.io/swagger/?format=openapi',
        },
        outputDir: './src/apis',
        to: async (context) => {
            const filenamePrefix = 'adminApi'
            const { schemasFiles } = await generateSchemaTypes(context, {
                filenamePrefix,
            })
            await generateReactQueryComponents(context, {
                filenamePrefix,
                schemasFiles,
            })
        },
    },
})
