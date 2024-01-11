"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                console.log('Generating email HTML with token:', token);
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'>Verify account</a>");
            }
        }
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
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
};
