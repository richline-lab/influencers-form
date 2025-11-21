// 🔒 Safe business use — NOT phishing
// سكربت خاص بإدارة نموذج بيانات التواصل التجاري لشركة Richline

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbypjJpC2xDRpXswsM3pArPQXNZ2X_KWE81E7LNa2bl00msYs_wFf6EI1tXRnulDM648/exec";

const form = document.querySelector(".client-intake-form");
const submitButton = form.querySelector('button[type="submit"]');
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", handleFormSubmit);

// =============================
// 🔥 تحقق: منصة واحدة على الأقل
// =============================
function validateAtLeastOnePlatform() {
    const platforms = ["tiktok", "snapchat", "instagram", "twitter"];

    for (let p of platforms) {
        if (form.querySelector(`[name="${p}"]`).value.trim() !== "") return true;
    }

    showErrorMessage("يجب إضافة منصة نشر واحدة على الأقل.");
    return false;
}

// =============================
// 🔥 تحقق الصفوف
// =============================
function validateRow(prefix) {
    const link = form.querySelector(`[name="${prefix}"]`);
    const followers = form.querySelector(`[name="${prefix}_followers"]`);
    const city = form.querySelector(`[name="${prefix}_city"]`);
    const price = form.querySelector(`[name="${prefix}_price"]`);

    if (link.value.trim() === "") return true;

    if (
        followers.value.trim() === "" ||
        city.value.trim() === "" ||
        price.value.trim() === ""
    ) {
        showErrorMessage(`برجاء إكمال جميع البيانات الخاصة بمنصة: ${prefix}`);
        return false;
    }

    return true;
}

// =============================
function validateAllRows() {
    return ["tiktok", "snapchat", "instagram", "twitter"].every(validateRow);
}

// =============================
// 🔥 إرسال النموذج
// =============================
async function handleFormSubmit(event) {
    event.preventDefault();

    if (form.name.value.trim() === "") {
        showErrorMessage("يرجى كتابة الاسم.");
        return;
    }

    if (form.trusted_number.value.trim() === "") {
        showErrorMessage("رقم التواصل الموثوق مطلوب.");
        return;
    }

    if (!validateAtLeastOnePlatform()) return;
    if (!validateAllRows()) return;

    submitButton.disabled = true;
    submitButton.textContent = "جاري الإرسال...";
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        showSuccessMessage();
        form.reset();
    } catch (error) {
        showErrorMessage("حدث خطأ أثناء الإرسال.");
    } finally {
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "إرسال النموذج";
        }, 800);
    }
}

// =============================
function showSuccessMessage() {
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
    setTimeout(() => (successMessage.style.display = "none"), 5000);
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
}
