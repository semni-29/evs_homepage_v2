document.addEventListener("DOMContentLoaded", () => {
  // 1. 헤더 스크롤 효과 (스크롤 시 배경색 변경)
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      window.scrollY > 50
        ? header.classList.add("scrolled")
        : header.classList.remove("scrolled");
    });
  }

  // 2. 모바일 메뉴 제어
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileCloseBtn = document.getElementById("mobile-close-btn");
  const mobileLinks = document.querySelectorAll(".mobile-menu-content a");

  if (mobileMenuBtn && mobileOverlay) {
    // 메뉴 열기
    mobileMenuBtn.addEventListener("click", () => {
      mobileOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // 스크롤 방지
    });

    // 메뉴 닫기 (X 버튼)
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", () => {
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = ""; // 스크롤 복구
      });
    }

    // 메뉴 링크 클릭 시 메뉴 닫기
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // 3. Contact 페이지 폼 제출 처리 (PHP 연동)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // 폼 새로고침 방지

      // 1. 폼 데이터 수집
      const typeEl = document.querySelector(
        'input[name="inquiry_type"]:checked',
      );
      const type = typeEl ? typeEl.value : "미선택";
      const name = document.getElementById("user-name").value;
      const phone = document.getElementById("user-phone").value;
      const address = document.getElementById("user-address").value;
      const message = document.getElementById("user-message").value;

      // 2. 전송용 FormData 객체 생성 (inquiry_type 분리 전송)
      const formData = new FormData();
      formData.append("inquiry_type", type); // PHP에서 메일 제목으로 사용할 데이터
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("message", message);

      // 3. 전송 중 버튼 상태 변경 (중복 클릭 방지)
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "메일 전송 중...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      // 4. PHP 파일로 데이터 전송 (Fetch API)
      fetch("contact_receiver.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((data) => {
          if (data.trim() === "success") {
            alert(
              "문의가 정상적으로 전송되었습니다. 담당자가 확인 후 곧 연락드리겠습니다.",
            );
            contactForm.reset(); // 전송 성공 시 폼 내용 비우기
          } else {
            alert(
              "메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n(에러: " +
                data +
                ")",
            );
          }
        })
        .catch((err) => {
          alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
          console.error(err);
        })
        .finally(() => {
          // 전송이 끝나면 (성공/실패 무관) 버튼 상태 복구
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        });
    });
  }

  // 4. 개인정보처리방침 팝업 제어
  const privacyBtn = document.getElementById("privacy-policy-btn");
  const privacyModal = document.getElementById("privacy-modal-overlay");
  const privacyCloseBtn = document.getElementById("privacy-close-btn");

  if (privacyBtn && privacyModal && privacyCloseBtn) {
    // 약관보기 클릭 시 팝업 열기
    privacyBtn.addEventListener("click", () => {
      privacyModal.classList.add("active");
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    });

    // X 버튼 클릭 시 팝업 닫기
    privacyCloseBtn.addEventListener("click", () => {
      privacyModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    // 팝업 배경(어두운 부분) 클릭 시 팝업 닫기
    privacyModal.addEventListener("click", (e) => {
      if (e.target === privacyModal) {
        privacyModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});
