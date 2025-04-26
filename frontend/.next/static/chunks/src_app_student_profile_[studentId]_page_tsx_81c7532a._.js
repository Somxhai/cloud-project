(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/student/profile/[studentId]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MyProfile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const ITEMS_PER_PAGE = 3;
const student = {
    name: "นางสาวพิมพ์ใจ แสนดี",
    id: "65123456",
    advisor: "ผศ. ดร. สมชาย ใจดี",
    department: "สาขาวิทยาการคอมพิวเตอร์"
};
const activities = [
    {
        id: 1,
        name: "อบรมการเขียนโปรแกรมเบื้องต้น",
        date: "2025-03-10",
        imageUrl: "/placeholder.png",
        description: "เรียนรู้พื้นฐาน Python และการเขียนโค้ดเบื้องต้น",
        skills: [
            {
                name: "Programming",
                level: 2,
                type: "hard"
            },
            {
                name: "Problem Solving",
                level: 2,
                type: "soft"
            }
        ],
        category: "วิชาการ"
    },
    {
        id: 2,
        name: "จิตอาสาพัฒนาโรงเรียน",
        date: "2025-02-25",
        imageUrl: "/placeholder.png",
        description: "ร่วมทำความสะอาดและปรับปรุงพื้นที่โรงเรียน",
        skills: [
            {
                name: "Teamwork",
                level: 4,
                type: "soft"
            },
            {
                name: "Leadership",
                level: 3,
                type: "soft"
            }
        ],
        category: "จิตอาสา"
    },
    {
        id: 3,
        name: "เข้าร่วมแข่งขันตอบปัญหาไอที",
        date: "2025-01-15",
        imageUrl: "/placeholder.png",
        description: "แข่งขันตอบคำถามด้านเทคโนโลยี",
        skills: [
            {
                name: "Critical Thinking",
                level: 3,
                type: "soft"
            },
            {
                name: "Technical Knowledge",
                level: 2,
                type: "hard"
            }
        ],
        category: "การแข่งขัน"
    },
    {
        id: 4,
        name: "ฝึกอบรมการสื่อสารองค์กร",
        date: "2025-04-01",
        imageUrl: "/placeholder.png",
        description: "อบรมพัฒนาทักษะการสื่อสารอย่างมืออาชีพ",
        skills: [
            {
                name: "Communication",
                level: 2,
                type: "soft"
            },
            {
                name: "Public Speaking",
                level: 3,
                type: "soft"
            }
        ],
        category: "พัฒนาตนเอง"
    },
    {
        id: 5,
        name: "โครงการพัฒนาทักษะการวิเคราะห์ข้อมูล",
        date: "2025-05-15",
        imageUrl: "/placeholder.png",
        description: "เวิร์กช็อปเกี่ยวกับการวิเคราะห์ข้อมูลพื้นฐาน",
        skills: [
            {
                name: "Data Analysis",
                level: 3,
                type: "hard"
            },
            {
                name: "Critical Thinking",
                level: 2,
                type: "soft"
            }
        ],
        category: "วิชาการ"
    }
];
function MyProfile() {
    _s();
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const onPageChange = (page)=>setCurrentPage(page);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen font-sans bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-6 sm:px-10 md:px-20 lg:px-32 py-10 space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-bold text-center",
                    children: "My Profile"
                }, void 0, false, {
                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                    lineNumber: 95,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold",
                            children: "Information"
                        }, void 0, false, {
                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                            lineNumber: 99,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-6 border-b sm:border-b-0 sm:border-r",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold mb-4",
                                            children: "Student Info"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "ชื่อ-นามสกุล:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 9
                                                }, this),
                                                " ",
                                                student.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "รหัสนักศึกษา:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 9
                                                }, this),
                                                " ",
                                                student.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "อาจารย์ที่ปรึกษา:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 9
                                                }, this),
                                                " ",
                                                student.advisor
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "สาขาวิชา:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 9
                                                }, this),
                                                " ",
                                                student.department
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 125,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                    lineNumber: 103,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-6 border-b sm:border-b-0 sm:border-r",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold mb-4",
                                            children: "Soft Skills"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "list-disc list-inside text-gray-700 space-y-1",
                                            children: activities.flatMap((a)=>a.skills).filter((s)=>s.type === "soft").map((skill, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        skill.name,
                                                        " - ",
                                                        skill.level
                                                    ]
                                                }, `soft-${idx}`, true, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 11
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 136,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold mb-4",
                                            children: "Hard Skills"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "list-disc list-inside text-gray-700 space-y-1",
                                            children: activities.flatMap((a)=>a.skills).filter((s)=>s.type === "hard").map((skill, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        skill.name,
                                                        " - ",
                                                        skill.level
                                                    ]
                                                }, `hard-${idx}`, true, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 11
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 153,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                            lineNumber: 101,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                    lineNumber: 98,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold",
                            children: "กิจกรรมที่เคยเข้าร่วม"
                        }, void 0, false, {
                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                            lineNumber: 169,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
                            children: currentItems.map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-2xl p-5 shadow-md bg-white space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold",
                                            children: activity.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: [
                                                "วันที่เข้าร่วม: ",
                                                activity.date
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 182,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative w-full h-56 rounded-md overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: activity.imageUrl,
                                                alt: activity.name,
                                                width: 600,
                                                height: 400,
                                                className: "object-cover w-full h-full rounded-md"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-gray-700",
                                            children: activity.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium",
                                            children: activity.category
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold mb-2",
                                                    children: "ทักษะที่ได้รับ:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 201,
                                                    columnNumber: 10
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-2",
                                                    children: activity.skills.map((skill, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full",
                                                            children: [
                                                                skill.name,
                                                                " (",
                                                                skill.type,
                                                                ") - ระดับ: ",
                                                                skill.level
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 12
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                            lineNumber: 200,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, activity.id, true, {
                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 8
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                            lineNumber: 173,
                            columnNumber: 6
                        }, this),
                        totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-8 space-x-2",
                            children: Array.from({
                                length: totalPages
                            }, (_, idx)=>{
                                const page = idx + 1;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentPage(page),
                                    className: `px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${page === currentPage ? "bg-[#E63946] text-white border-[#E63946]" : "bg-white text-[#E63946] border-[#E63946] hover:bg-[#E63946] hover:text-white"}`,
                                    children: page
                                }, page, false, {
                                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 10
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                            lineNumber: 222,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
                    lineNumber: 168,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
            lineNumber: 94,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/student/profile/[studentId]/page.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, this);
}
_s(MyProfile, "6xAUoJ2motYJ38x4zeUWisA+X/4=");
_c = MyProfile;
var _c;
__turbopack_context__.k.register(_c, "MyProfile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_student_profile_%5BstudentId%5D_page_tsx_81c7532a._.js.map