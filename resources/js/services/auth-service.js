import $ from "jquery";
import Swal from "sweetalert2";

export function login() {
    const urlAuth = $("#submit-login").data("url-login");
    $("#login-form").on("submit", function (event) {
        event.preventDefault();
        let button = $("#submit-login");
        let icon = button.find("i");
        let text = button.find("span");
        text.text("Login...");
        icon.removeClass("fa-solid fa-right-to-bracker").addClass(
            "fa-solid fa-spinner fa-spin",
        );
        button.attr("disabled", true);
        $("#name").removeClass("is-invalid");
        $("#password").removeClass("is-invalid");
        $("#error-name-login").html("");
        $("#error-password-login").html("");
        let formData = new FormData(this);
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            cache: false,
            contentType: false,
            processData: false,
            method: "POST",
            url: urlAuth,
            data: formData,
            dataType: "json",
            success: function (response) {
                if (response.status == "success") {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "success",
                        title: response.message,
                    });
                    $("#login-form")[0].reset();
                    setTimeout(() => {
                        window.location.href = response.url;
                    }, 1700);
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "error",
                        title: response.message,
                    });
                }
            },
            error: function (response) {
                if (response.status == 422) {
                    let errorResponse = JSON.parse(response.responseText);
                    if (errorResponse.errors && errorResponse.errors.name) {
                        let errors = errorResponse.errors;
                        $("#name").addClass("is-invalid");
                        $("#error-name-login").html(errors.name[0]);
                    }
                    if (errorResponse.errors && errorResponse.errors.password) {
                        let errors = errorResponse.errors;
                        $("#password").addClass("is-invalid");
                        $("#error-password-login").html(errors.password[0]);
                    }
                } else {
                    errorAjaxResponse(response);
                }
            },
            complete: function () {
                text.text("Login");
                icon.removeClass("fa-spinner fa-spin").addClass(
                    "fa-right-to-bracker",
                );
                button.removeAttr("disabled");
            },
        });
    });
}

export function logout() {
    const urlLogout = $("#logout").data("logout-url");
    $("#logout").on("click", function (event) {
        event.preventDefault();
        Swal.fire({
            title: "Apakah kamu yakin?",
            text: "Kamu akan logout dari sistem ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Iya, logout",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content",
                        ),
                    },
                    type: "GET",
                    url: urlLogout,
                    dataType: "json",
                    success: function (response) {
                        if (response.status == "success") {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.onmouseenter = Swal.stopTimer;
                                    toast.onmouseleave = Swal.resumeTimer;
                                },
                            });
                            Toast.fire({
                                icon: "success",
                                title: response.message,
                            });
                            setTimeout(() => {
                                window.location.href = response.url;
                            }, 1700);
                        } else {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.onmouseenter = Swal.stopTimer;
                                    toast.onmouseleave = Swal.resumeTimer;
                                },
                            });
                            Toast.fire({
                                icon: "error",
                                title: response.message,
                            });
                        }
                    },
                    error: function (response) {
                        errorAjaxResponse(response);
                    },
                }); 
            }
        });
    });
}
