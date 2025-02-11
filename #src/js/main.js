const header = document.querySelector(".header")
const iconMenu = document.querySelector('.icon-menu');
const modal = document.querySelectorAll(".modal")
const modOpenBtn = document.querySelectorAll(".mod-open-btn")
const modCloseBtn = document.querySelectorAll(".mod-close-btn")
const successModal = document.querySelector("#success-mod")
const errorModal = document.querySelector("#error-mod")
const dropdown = document.querySelectorAll(".dropdown")
let animSpd = 400
let desktopW = 1260.98
let tabletW = 1024.98
let mob = 767.98
//get path to sprite id
function sprite(id) {
    return '<svg><use xlink:href="img/icons/sprite.svg#' + id + '"></use></svg>'
}
//scroll pos
function scrollPos() {
    return window.pageYOffset || document.documentElement.scrollTop
}
//enable scroll
function enableScroll() {
    if (document.querySelectorAll(".fixed-block")) {
        document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
    }
    document.body.style.paddingRight = '0px'
    document.body.classList.remove("no-scroll")
}
//disable scroll
function disableScroll() {
    let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
    if (document.querySelectorAll(".fixed-block")) {
        document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
    }
    document.body.style.paddingRight = paddingValue
    document.body.classList.add("no-scroll");
}
//smoothdrop
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `all ${animDur}ms ease`;
    body.style['-webkit-transition'] = `all ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        let height = body.clientHeight + 'px';
        body.style.height = height
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
            }, animDur);
        }, 0);
    }
}
// custom scroll FF
const customScroll = document.querySelectorAll(".custom-scroll")
let isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
    document.documentElement.style.scrollbarColor = "#231f2033 #F8F8F8"
}
if (isFirefox && customScroll) {
    customScroll.forEach(item => { item.style.scrollbarColor = "#231f2033 #F8F8F8" })
}
//fixed header
let lastScroll = scrollPos();
window.addEventListener("scroll", () => {
    if (scrollPos() > 1) {
        header.classList.add("scroll")
        if (header.classList.contains("header--main")) {
            header.classList.remove("header--light")
        }
        if ((scrollPos() > lastScroll && scrollPos() > 150 && !header.classList.contains("unshow"))) {
            header.classList.add("unshow")
        } else if (scrollPos() < lastScroll && header.classList.contains("unshow")) {
            header.classList.remove("unshow")
        }
    } else {
        header.classList.remove("scroll")
        header.classList.remove("unshow")
        if (header.classList.contains("header--main")) {
            header.classList.add("header--light")
        }
    }
    lastScroll = scrollPos()
})
//open modal
function openModal(modal) {
    let activeModal = document.querySelector(".modal.open")
    if (!activeModal && !header.classList.contains("show-menu")) {
        disableScroll()
    }
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    modal.classList.remove("open")
    setTimeout(() => {
        if (!header.classList.contains("show-menu")) {
            enableScroll()
        }
    }, animSpd);
}
// modal click outside
if (modal) {
    modal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".modal__content").contains(e.target) ||
                mod.querySelector(".btn-close").contains(e.target) ||
                (mod.querySelector(".modal__close") && mod.querySelector(".modal__close").contains(e.target))) {
                closeModal(mod);
            }
        });
    });
}
// modal button on click
if (modOpenBtn) {
    modOpenBtn.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault()
            let href = btn.getAttribute("data-modal")
            openModal(document.getElementById(href))
        })
    })
}
// modal close button on click
if (modCloseBtn) {
    modCloseBtn.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault()
            let href = btn.getAttribute("data-modal")
            closeModal(document.getElementById(href))
        })
    })
}
let dropdownTimeout
//open dropdown
function openDropdown(item) {
    item.classList.add("open");
    item.setAttribute("aria-expanded", true);
    item.querySelectorAll(".dropdown__options input").forEach(inp => {
        inp.addEventListener("change", (e) => {
            setActiveOption(item, inp.value)
        });
    });
    document.addEventListener("click", function clickOutside(e) {
        if (!item.contains(e.target)) {
            closeDropdown(item)
            document.removeEventListener('click', clickOutside);
        }
    });
    if (window.innerWidth < tabletW && item.closest(".orders-filter")) {
        clearTimeout(dropdownTimeout)
        item.querySelector(".dropdown__body").style.display = 'block';
        let height = item.querySelector(".dropdown__body").clientHeight + 'px';
        item.querySelector(".dropdown__body").style.height = '0px';
        setTimeout(function () {
            item.querySelector(".dropdown__body").style.height = height;
            dropdownTimeout = setTimeout(() => {
                item.querySelector(".dropdown__body").style.height = null
            }, 500);
        }, 0);
    }
}
// set active option
function setActiveOption(item, value) {
    if (item.classList.contains("radio-select")) {
        if (value == 'all') {
            item.querySelector(".dropdown__header").classList.remove("checked")
            item.querySelector(".dropdown__header span").innerHTML = item.querySelector(".dropdown__header span").getAttribute('data-init-text') || 'Не выбрано'
        } else {
            item.querySelector(".dropdown__header").classList.add("checked")
            let activeInpTxt = item.querySelector("input:checked").nextElementSibling.innerHTML
            item.querySelector(".dropdown__header span").innerHTML = activeInpTxt
        }
        closeDropdown(item)
    }
}
//uncheck active options
function uncheckSelectOptions(item) {
    item.querySelectorAll("input").forEach(inp => {
        inp.removeAttribute('checked')
        inp.checked = false
    })
    item.querySelector('.dropdown__header').classList.remove("checked")
    item.querySelector('.dropdown__header span').innerHTML = item.querySelector('.dropdown__header span').getAttribute("data-init-text") || 'Не выбрано'
}
//close dropdonw
function closeDropdown(item) {
    item.classList.remove("open");
    item.setAttribute("aria-expanded", false);
    if (window.innerWidth < tabletW && item.closest(".orders-filter")) {
        clearTimeout(dropdownTimeout)
        let height = item.querySelector(".dropdown__body").clientHeight + 'px';
        item.querySelector(".dropdown__body").style.height = height
        setTimeout(function () {
            item.querySelector(".dropdown__body").style.height = "0"
            dropdownTimeout = setTimeout(() => {
                item.querySelector(".dropdown__body").style.display = 'none';
                item.querySelector(".dropdown__body").style.height = null
            }, 500);
        }, 0);
    }
}
//dropdown
if (dropdown) {
    dropdown.forEach(item => {
        item.querySelector(".dropdown__header").addEventListener("click", () => {
            item.classList.contains("open") ? closeDropdown(item) : openDropdown(item)
        })
    })
}
//setSuccessTxt
function setSuccessTxt(title = false, txt = false, btnTxt = false) {
    successModal.querySelector("h2").textContent = title ? title : "Заявка успешно отправлена"
    successModal.querySelector(".main-btn").textContent = btnTxt ? btnTxt : "Закрыть"
    if (txt) {
        successModal.querySelector("p").textContent = txt
    }
}
//setErrorTxt
function setErrorTxt(title = false, txt = false, btnTxt = false) {
    errorModal.querySelector("h2").textContent = title ? title : "Ошибка"
    errorModal.querySelector(".main-btn").textContent = btnTxt ? btnTxt : "Закрыть"
    if (txt) {
        errorModal.querySelector("p").textContent = txt
    }
}
// openSuccessMod
function openSuccessMod(title = false, txt = false, btnTxt = false) {
    setSuccessTxt(title, txt, btnTxt)
    openModal(successModal)
}
// openErrorMod
function openErrorMod(title = false, txt = false, btnTxt = false) {
    setErrorTxt(title, txt, btnTxt)
    openModal(errorModal)
}
// formSuccess
function formSuccess(form) {
    form.querySelectorAll(".item-form").forEach(item => item.classList.remove("error"))
    form.querySelectorAll("input").forEach(inp => {
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
        if (["checkbox", "radio"].includes(inp.type) && !inp.classList.contains("required")) {
            inp.checked = false
        }
    })
    if (form.querySelector("textarea")) {
        form.querySelector("textarea").value = ""
    }
    if (form.querySelector(".file-form__items")) {
        form.querySelector(".file-form__items").innerHTML = ""
    }
}
// search form
const searchForm = document.querySelectorAll(".search-form")
function showResetBtn(item) {
    if (item.querySelector("input").value.length > 0) {
        item.querySelector(".search-form__reset").classList.add("show")
    } else {
        item.querySelector(".search-form__reset").classList.remove("show")
    }
}
if (searchForm) {
    searchForm.forEach(item => {
        showResetBtn(item)
        item.querySelector("input").addEventListener("input", () => showResetBtn(item))
        item.addEventListener("reset", () => {
            item.classList.remove("show-results")
            item.querySelector("input").setAttribute("value", "")
            showResetBtn(item)
        })
    })
}
const itemFormPass = document.querySelectorAll(".item-form--password")
if (itemFormPass) {
    itemFormPass.forEach(item => {
        item.querySelector(".item-form__eye").addEventListener("click", () => {
            item.classList.toggle("show-password")
            if (item.classList.contains("show-password")) {
                item.querySelector("input").type = "text"
            } else {
                item.querySelector("input").type = "password"
            }
        })
    })
}
//mask input
const inp = document.querySelectorAll('input[type=tel]')
if (inp) {
    inp.forEach(item => {
        Inputmask({ "mask": "+7 999 999-99-99" }).mask(item);
    })
}
// phone validation
function isPhone(value) {
    return value.match(/^\+7 \d{3} \d{3}-\d{2}-\d{2}$/) ? true : false
}
//email mask
function maskEmail(email) {
    const [username, domain] = email.split('@');
    let maskedUsername = '';
    if (username.length <= 3) {
        maskedUsername = username.substring(0, 1) + "***";
    } else {
        maskedUsername = username.substring(0, 2) + '***' + username.substring(username.length - 1);
    }
    return maskedUsername + '@' + domain;
}
//file-form
let fileTypes = [
    "image/png", "image/jpeg", //.png, .jpeg, .jpg
    "application/pdf", //.pdf
    "application/msword", //.doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //.docx
    "application/vnd.ms-powerpoint", //.ppt 
    "application / vnd.openxmlformats - officedocument.presentationml.presentation", //.pptx
]
function addFile(files, item) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        if (file.size > 3 * 1024 * 1024) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach(item => item.remove())
            item.querySelector("[data-error]").textContent = "Файл должен быть менее 3 МБ"
            return
        } else if (!fileTypes.includes(file.type)) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach(item => item.remove())
            item.querySelector("[data-error]").textContent = 'Разрешённые форматы: png, jpg, jpeg, pdf, doc, docx, ppt, pptx'
            return
        } else {
            item.classList.remove("error")
            item.querySelector("[data-error").textContent = ""
            let reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = () => {
                item.querySelector(".file-form__items").insertAdjacentHTML("afterbegin", `<div class="file-form__item">
                        <div class="file-form__info">
                            <div class="file-form__name">${file.name}</div>
                            <div class="file-form__size">${Math.ceil(file.size / 1024 / 1024 * 100) / 100} Mb</div>
                        </div>
                        <div class="file-form__del">Удалить</div>
                     </div>
                    `)
            }
            reader.onerror = () => {
                console.log(reader.error);
            }
        }
    }
}
let dragEl
if (document.querySelector(".file-form")) {
    document.querySelectorAll(".file-form").forEach(item => {
        item.querySelector("input").addEventListener("change", e => {
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            let files = e.target.files;
            addFile(files, item)
        })
        //delete file
        item.addEventListener("click", e => {
            item.querySelectorAll(".file-form__del").forEach((del, idx) => {
                if (del.contains(e.target)) {
                    const dt = new DataTransfer()
                    const input = item.querySelector("input")
                    const { files } = input
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i]
                        if (i !== idx) {
                            dt.items.add(file)
                        }
                    }
                    input.files = dt.files
                    setTimeout(() => {
                        del.parentNode.remove()
                    }, 0);
                }
            })
        })
        dragEl = item
        dragEl.addEventListener("dragenter", e => {
            e.preventDefault();
        })
        dragEl.addEventListener("dragover", e => {
            e.preventDefault();
        })
        dragEl.addEventListener("dragleave", e => {
            e.preventDefault();
        })
        dragEl.addEventListener("drop", function (e) {
            e.preventDefault();
            const dt = new DataTransfer()
            if (item.querySelector("input").hasAttribute("multiple")) {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    dt.items.add(e.dataTransfer.files[i])
                }
            } else {
                dt.items.add(e.dataTransfer.files[0])
            }
            let files = Array.from(dt.files)
            item.querySelector("input").files = dt.files
            item.querySelectorAll(".file-form__item").forEach(item => item.remove())
            addFile(files, item)
        });
    })
}
//accordion
function toggleAccordion(item) {
    item.parentNode.parentNode.querySelectorAll(".accordion").forEach(el => {
        if (el.querySelector(".accordion__header").classList.contains("active")) {
            smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
            if (el.getBoundingClientRect().top < 0) {
                let pos = scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                window.scrollTo(0, pos)
            }
        }
    })
    smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
}
//icon-menu
if (iconMenu) {
    iconMenu.addEventListener("click", () => {
        if (!header.classList.contains("show-menu")) {
            disableScroll()
            header.classList.add("show-menu")
            iconMenu.setAttribute("aria-label", "Закрыть меню")
            window.addEventListener("resize", () => {
                if (header.classList.contains("show-menu") && window.innerWidth > desktopW) {
                    iconMenu.click()
                }
            })
        } else {
            enableScroll()
            header.classList.remove("show-menu")
            iconMenu.setAttribute("aria-label", "Открыть меню")
        }
    })
}
//article swiper
const articleSwiper = document.querySelector(".article__swiper")
if (articleSwiper) {
    const swiper = new Swiper(articleSwiper.querySelector(".swiper"), {
        observe: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
        allowTouchMove: false,
        pagination: {
            el: articleSwiper.querySelector(".swiper-pagination"),
            type: "bullets",
            clickable: true,
        },
        navigation: {
            nextEl: articleSwiper.querySelector(".nav-btn--next"),
            prevEl: articleSwiper.querySelector(".nav-btn--prev")
        }
    })
}
//form button disabled
const disabledForm = document.querySelectorAll(".disabled-form")
function checkForm(form) {
    let findItem = Array.from(form.querySelectorAll("input.required")).find(inp => {
        if ((inp.value && inp.type === 'tel' && !isPhone(inp.value)) || !inp.value) {
            return inp
        }
    })
    findItem ? form.querySelector("button[type=submit]").setAttribute("disabled", true) : form.querySelector("button[type=submit]").removeAttribute("disabled")
}
if (disabledForm.length > 0) {
    disabledForm.forEach(form => {
        if (form.querySelectorAll("input.required").length > 0) {
            checkForm(form)
            form.querySelectorAll("input.required").forEach(inp => {
                inp.addEventListener("change", () => {
                    checkForm(form)
                })
            })
        }
    })
}
//reset password
let codeResTimeout
function resetPassword(email) {
    clearTimeout(codeResTimeout)
    document.querySelector(".resend-pass__btn").setAttribute("disabled", true)
    let val = +document.querySelector("[data-pass-form=send-pass]").getAttribute("data-timeout") || 30
    document.querySelector("[data-pass-form=send-pass]").style.display = 'none'
    document.querySelector(".resend-pass__timeout").style.display = 'block'
    if (document.querySelector(".reset-pass-txt")) {
        document.querySelector(".reset-pass-txt").textContent = `Мы отправили письмо на электронный адрес ${maskEmail(email)}`
    }
    document.querySelector("[data-pass-form=resend-pass]").style.display = 'block'
    function changeTimeVal() {
        if (val > 0) {
            document.querySelector(".resend-pass__min").textContent = parseInt(val / 60)
            document.querySelector(".resend-pass__sec").textContent = val % 60 < 10 ? '0' + val % 60 : val % 60
            codeResTimeout = setTimeout(changeTimeVal, 1000);
        } else {
            clearTimeout(codeResTimeout)
            document.querySelector(".resend-pass__timeout").style.display = 'none'
            document.querySelector(".resend-pass__btn").removeAttribute("disabled")
        }
        val--
    }
    changeTimeVal()
}
//orders filter
const orders = document.querySelector(".orders")
const ordersFilterBtn = document.querySelector(".filter-btn")
const ordersFilter = document.querySelector(".orders-filter")
const ordersSort = document.querySelectorAll(".orders__cols [data-sortBy]")
function checkSelectedCount() {
    let count = 0
    const statusChecked = ordersFilter.querySelector(".status-select input:checked")
    if (statusChecked && statusChecked.value !== 'all') {
        count++
    }
    ordersFilter.querySelectorAll('.js-datepicker').forEach(item => item.value ? count++ : "")
    document.querySelector(".filter-btn__count").textContent = count > 0 ? count : ''
    count > 0 ? ordersFilterBtn.classList.add("is-filtered") : ordersFilterBtn.classList.remove("is-filtered")
}
function initOrderDatepicker() {
    if (ordersFilter.querySelectorAll('.js-datepicker').length > 0) {
        ordersFilter.querySelectorAll('.js-datepicker').forEach(item => {
            flatpickr(item, {
                dateFormat: "d.m.Y",
                locale: "ru",
                disableMobile: "true",
                onChange: function (selectedDates, dateStr, instance) {
                    if (selectedDates.length > 0 && item.getAttribute("data-name") == 'start-date') {
                        let startDate = selectedDates[0];
                        let endDatePicker = item.closest(".form__grid").querySelector("[data-name=end-date]")._flatpickr;
                        if (endDatePicker && endDatePicker.selectedDates.length > 0 && startDate > endDatePicker.selectedDates[0]) {
                            endDatePicker.setDate(startDate);
                        }
                        if (endDatePicker) {
                            endDatePicker.set("minDate", startDate);
                        }
                    }
                    checkSelectedCount()
                }
            });
        })
    }
}
function resetOrderDatepicker() {
    if (ordersFilter.querySelectorAll('.js-datepicker').length > 0) {
        ordersFilter.querySelectorAll('.js-datepicker').forEach(inp => {
            if (inp._flatpickr) {
                inp._flatpickr.clear()
            }
        })
    }
}
function showOrderFilter() {
    if (window.innerWidth < tabletW) {
        disableScroll()
    }
    document.querySelector(".overlay").addEventListener("click", function clickOutside() {
        if (ordersFilterBtn.classList.contains("active") && window.innerWidth < tabletW) {
            unshowOrderFilter()
            document.removeEventListener('click', clickOutside);
        }
    })
    ordersFilterBtn.classList.add("active")
    ordersFilter.classList.add("show")
    document.querySelector(".overlay").classList.add("show")
}
function unshowOrderFilter() {
    enableScroll()
    ordersFilterBtn.classList.remove("active")
    ordersFilter.classList.remove("show")
    document.querySelector(".overlay").classList.remove("show")
}
function resetOrderFilter() {
    resetOrderDatepicker()
    if (ordersFilter.querySelectorAll("[data-order-type]").length > 0) {
        ordersFilter.querySelectorAll("[data-order-type]")[0].click()
    }
    ordersFilter.querySelectorAll(".status-select").forEach(item => {
        uncheckSelectOptions(item)
    })
    checkSelectedCount()
}
if (ordersFilter) {
    ordersFilterBtn.addEventListener("click", showOrderFilter)
    ordersFilter.querySelector(".btn-close").addEventListener("click", unshowOrderFilter)
    ordersFilter.querySelector(".orders-filter__close").addEventListener("click", unshowOrderFilter)
    window.addEventListener("resize", () => {
        if (ordersFilterBtn.classList.contains("active") && window.innerWidth > tabletW) {
            enableScroll()
        }
    })
    ordersFilter.querySelectorAll(".service-select input").forEach(inp => {
        inp.addEventListener("change", () => {
            let attr = inp.getAttribute("data-order-type")
            ordersFilter.querySelectorAll(".status-select").forEach(item => {
                if (item.getAttribute("data-order-status") != attr) {
                    uncheckSelectOptions(item)
                    item.classList.remove("current")
                } else {
                    item.classList.add("current")
                }
            })
            checkSelectedCount()
        })
    })
    ordersFilter.querySelectorAll(".status-select input").forEach(inp => {
        inp.addEventListener("change", checkSelectedCount)
    })
    initOrderDatepicker()
    ordersFilter.querySelector("form").addEventListener('reset', resetOrderFilter)
}
if (orders) {
    orders.addEventListener("click", e => {
        if (document.querySelectorAll(".orders__cols [data-sortBy]").length > 0) {
            document.querySelectorAll(".orders__cols [data-sortBy]").forEach(item => {
                if (item.contains(e.target)) {
                    if (item.classList.contains("active")) {
                        let attr = item.getAttribute("data-order")
                        item.setAttribute("data-order", attr === "asc" ? "desc" : "asc")
                    } else {
                        ordersSort.forEach(el => {
                            el.classList.remove("active")
                            el.setAttribute("data-order", "asc")
                        })
                        item.classList.add("active")
                    }
                }
            })
        }
        if (orders.querySelectorAll(".accordion").length > 0) {
            orders.querySelectorAll(".accordion").forEach(item => {
                if (item.querySelector(".accordion__header").contains(e.target)) {
                    toggleAccordion(item)
                }
            })
        }
        if (orders.querySelectorAll(".order-mod-open-btn").length > 0) {
            orders.querySelectorAll(".order-mod-open-btn").forEach(item => {
                if (item.contains(e.target)) {
                    e.preventDefault()
                    let href = item.getAttribute("data-modal")
                    let orderNmb = item.getAttribute("data-order-number")
                    document.getElementById(href).querySelector(".order-details p").textContent = orderNmb || ''
                    document.getElementById(href).querySelector("input[name=order-number]").value = orderNmb || ''
                    openModal(document.getElementById(href))
                }
            })
        }
    })
}