import moment from "moment";

export const reportDuration = [
    { value: "", label: "All Time" },
    { value: `${moment().format("YYYY-MM-DD")}~${moment().format("YYYY-MM-DD")}`, label: "Today" },
    { value: `${moment().subtract(1, "days").format("YYYY-MM-DD")}~${moment().subtract(1, "days").format("YYYY-MM-DD")}`, label: "Yesterday" },
    { value: `${moment().subtract(6, "days").format("YYYY-MM-DD")}~${moment().format("YYYY-MM-DD")}`, label: "Last 7 Days" },
    { value: `${moment().subtract(29, "days").format("YYYY-MM-DD")}~${moment().format("YYYY-MM-DD")}`, label: "Last 30 Days" },
    { value: `${moment().startOf("month").format("YYYY-MM-DD")}~${moment().endOf("month").format("YYYY-MM-DD")}`, label: "This Month" },
    { value: `${moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD")}~${moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD")}`, label: "Last Month" },
]  