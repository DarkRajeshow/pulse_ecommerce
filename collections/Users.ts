import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                console.log('Generating email HTML with token:', token);
                return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a>`
            }
        }
    },
    access: {
        read: () => true,
        create: () => true,
    },
    fields: [
        {
            name: "role",
            defaultValue: "user",
            type: "select",
            required: true,
            // admin: {
            //     condition: () => false
            // },
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
            ]
        }
    ]
}