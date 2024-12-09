// Init
(function (d, script) {
  script = d.createElement("script");
  script.type = "application/javascript";
  script.async = true;
  script.onload = function () {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function () {
      //OneSignal.setConsentRequired(true);
      OneSignal.init({
        //appId: "380dc082-5231-4cc2-ab51-a03da5a0e4c2", // testing
        allowLocalhostAsSecureOrigin: true,
        appId: "b58dc388-966a-4b2e-a4b1-ed21611ca8e8", //main
        serviceWorkerParam: { scope: "/js/" },
        serviceWorkerPath: "OneSignalSDKWorker.js",
      });
    });
  };
  script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
  d.getElementsByTagName("head")[0].appendChild(script);
})(document);

window.addEventListener("load", () => {
  console.log("Window loaded, initializing OneSignal");

  if (!window.OneSignal) {
    console.error("OneSignal SDK not loaded!");
    return;
  }

  // Register
  const registerSubmitBtn = document.getElementById("registerSubmitBtn");
  if (registerSubmitBtn) {
    registerSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let name = document.getElementById("registerName").value;
      let email = document.getElementById("registerEmail").value;
      let phone = document.getElementById("registerPhone").value;
      let category = document.getElementById("registerCategory").value;

      if (email) {
        OneSignal.login(email); // set email as external_id
        OneSignal.User.addEmail(email);
        console.log(email, "Registered Email");
      }

      if (name) {
        OneSignal.User.addAlias("name", name);
        console.log(name, "Registered Name");
      }

      if (phone) {
        OneSignal.User.addSms(`+${phone}`);
        console.log(phone, "Registered Phone");
      }

      // send outcome User registered
      OneSignal.session.sendOutcome("user_registered")

      const form = document.getElementById("registerForm")
      form.reset()
      const registerModal = document.getElementById("registerModal");
      const modal = bootstrap.Modal.getInstance(registerModal);
      modal.hide();
    });
  } else {
    console.warn("Register button not found.");
  }
  // Login
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let email = document.getElementById("loginEmail").value;

      if (email) {
        OneSignal.login(email); // login with email as external_id
        console.log(OneSignal.User.externalId, "Logged In User EXTERNAL_ID");
      }

      // send outcome User Logged in
      OneSignal.session.sendOutcome("user_logged_in")

      const form = document.getElementById("loginForm")
      form.reset()
      const registerModal = document.getElementById("loginModal");
      const modal = bootstrap.Modal.getInstance(registerModal);
      modal.hide();
    });
  } else {
    console.warn("Login button not found.");
  }
  // Add Tag
  const addTagWithFieldsButton = document.getElementById(
    "addTagWithFieldsButton"
  );
  if (addTagWithFieldsButton) {
    addTagWithFieldsButton.addEventListener("click", (e) => {
      e.preventDefault();
      let tagKey = document.getElementById("tagKey").value;
      let tagValue = document.getElementById("tagValue").value;

      if (tagKey || tagValue) {
        OneSignal.User.addTag(
          document.getElementById("tagKey").value,
          document.getElementById("tagValue").value
        );
        console.log(tagKey, "Tag Key");
        console.log(tagValue, "Tag Value");
      }

      // send outcome User Added Tag
      OneSignal.session.sendOutcome("user_added_tag")

      const form = document.getElementById("tagForm")
      form.reset()
    });
  } else {
    console.warn("Add Tag Submit button not found.");
  }
});
