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
    registerSubmitBtn.addEventListener("click", () => {
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const phone = document.getElementById("registerPhone").value;
      const category = document.getElementById("registerCategory").value;

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
    });
  } else {
    console.warn("Register button not found.");
  }
  // Login
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", () => {
      const email = document.getElementById("loginEmail").value;

      if (email) {
        OneSignal.login(email); // login with email as external_id
        console.log(OneSignal.User.externalId, "Logged In User EXTERNAL_ID");
      }
    });
  } else {
    console.warn("Login button not found.");
  }
  // Add Tag
  const addTagWithFieldsButton = document.getElementById(
    "addTagWithFieldsButton"
  );
  if (addTagWithFieldsButton) {
    addTagWithFieldsButton.addEventListener("click", () => {
      OneSignalDeferred.push(function () {
        const tagKey = document.getElementById("tagKey").value;
        const tagValue = document.getElementById("tagValue").value;

        if (tagKey || tagValue) {
          OneSignal.User.addTag(
            document.getElementById("tagKey").value,
            document.getElementById("tagValue").value
          );
          console.log(tagKey, "Tag Key");
          console.log(tagValue, "Tag Value");
        }
      });
    });
  } else {
    console.warn("Add Tag Submit button not found.");
  }
});
