// This mock file strictly mirrors the 9 core endpoints of the CSAT Backend
// 5 GET, 4 POST

export const mockUser = {
    id: 1,
    email: "manager@divinecoffee.com",
    is_active: true
};

// 1. GET /api/v1/forms/ (List My Forms)
export const mockForms = [
    {
        id: 101,
        title: "Divine Barista Quality",
        description: "Monitoring the extraction and temperature standards of Divine coffee.",
        is_active: true,
        created_at: "2026-02-14T10:00:00Z",
        owner_id: 1
    },
    {
        id: 102,
        title: "Divine Space Hygiene",
        description: "Maintaining the premium Divine seating and hygiene standards.",
        is_active: true,
        created_at: "2026-02-10T15:30:00Z",
        owner_id: 1
    }
];

// 2. GET /api/v1/forms/{id} (Single Form Config)
export const getFormConfig = (id: number) => mockForms.find(f => f.id === id);

// 3. GET /api/v1/submissions/forms/{form_id}/submissions (List Submissions)
export const mockSubmissions = [
    {
        id: 1,
        form_id: 101,
        rating: 5,
        feedback: "The Mocha was perfectly extracted. Excellent service!",
        customer_name: "Sarah Miller",
        customer_email: "sarah@example.com",
        ip_address: "15.206.44.230",
        screenshot_url: null,
        created_at: "2026-02-15T09:12:00Z"
    },
    {
        id: 2,
        form_id: 101,
        rating: 2,
        feedback: "Cold coffee and long wait time today.",
        customer_name: "James Wilson",
        customer_email: "james@example.com",
        ip_address: "15.206.44.231",
        screenshot_url: "https://via.placeholder.com/600x400?text=Cold+Coffee+Evidence",
        created_at: "2026-02-15T14:30:00Z"
    }
];

// 4. GET /api/v1/reports/{form_id}/analytics
export const mockAnalytics = {
    form_id: 101,
    total_avg_rating: 4.35,
    avg_30_days: 4.4,
    avg_60_days: 4.2,
    avg_90_days: 4.1,
    rating_distribution: {
        1: 4,
        2: 8,
        3: 15,
        4: 45,
        5: 130
    },
    total_submissions: 202,
    unique_respondents: 185
};

// 5. GET /api/v1/submissions/forms/{form_id}/download/bulk (Trigger Logic Only)
export const triggerBulkDownload = (formId: number) => {
    console.log(`Executing GET /api/v1/submissions/forms/${formId}/download/bulk`);
    alert(`Downloading bulk report for Sensor #${formId}...`);
};

// 6. POST /api/v1/auth/login/access-token
export const mockLogin = (email: string) => ({
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    token_type: "bearer"
});

// 7. POST /api/v1/auth/register
export const mockRegister = (data: any) => ({
    ...mockUser,
    email: data.email
});

// 8. POST /api/v1/forms/ (Create)
export const createForm = (data: any) => ({
    id: Math.floor(Math.random() * 1000),
    ...data,
    created_at: new Date().toISOString()
});

// 9. POST /api/v1/submissions/submit/{form_id} (Public)
export const submitFeedback = (formId: number, data: any) => ({
    id: Math.floor(Math.random() * 1000),
    form_id: formId,
    ...data,
    ip_address: "127.0.0.1",
    created_at: new Date().toISOString()
});
