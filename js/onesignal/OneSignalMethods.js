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
    registerSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let name = document.getElementById("registerName").value;
      let email = document.getElementById("registerEmail").value;
      let phone = document.getElementById("registerPhone").value;
      let category = document.getElementById("registerCategory").value;

      if (email) {
        const login = await OneSignal.login(email); // set email as external_id
        console.log(login, "User Login")
        const addEmail = await OneSignal.User.addEmail(email);
        console.log(addEmail, "Registered Email");
      }

      if (name) {
        const nameAlias = await OneSignal.User.addAlias("name", name);
        console.log(nameAlias, "Registered Name");
      }

      if (phone) {
        const addPhone = await OneSignal.User.addSms(`+${phone}`);
        console.log(addPhone, "Registered Phone");
      }

      // send outcome User registered
      const registerOutcome = await OneSignal.Session.sendOutcome("user_registered");
      console.log(registerOutcome, "Register Outcome")

      const form = document.getElementById("registerForm");
      form.reset();
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
    loginSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let email = document.getElementById("loginEmail").value;

      if (email) {
        const loginAccount = await OneSignal.login(email); // login with email as external_id
        console.log(loginAccount, "Logged In User Account");
      }

      // send outcome User Logged in
      const loginOutcome = await OneSignal.Session.sendOutcome("user_logged_in");
      console.log(loginOutcome, "Login Outcome")

      const form = document.getElementById("loginForm");
      form.reset();
      const registerModal = document.getElementById("loginModal");
      const modal = bootstrap.Modal.getInstance(registerModal);
      modal.hide();
      document.querySelector("#loginBtn").classList.add("d-none");
      document.querySelector("#logoutBtn").classList.remove("d-none");
    });
  } else {
    console.warn("Login button not found.");
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const logout = await OneSignal.logout();
      console.log(logout, "User signed out.");
      document.querySelector("#logoutBtn").classList.add("d-none");
      document.querySelector("#loginBtn").classList.remove("d-none");
    });
  } else {
    console.warn("Logout button not found.");
  }

  // Add Tag
  const addTagWithFieldsButton = document.getElementById(
    "addTagWithFieldsButton"
  );
  if (addTagWithFieldsButton) {
    addTagWithFieldsButton.addEventListener("click", async (e) => {
      e.preventDefault();
      let tagKey = document.getElementById("tagKey").value;
      let tagValue = document.getElementById("tagValue").value;

      if (tagKey || tagValue) {
        const addTag = await OneSignal.User.addTag(tagKey, tagValue);
        console.log(addTag, "Added Tag");
      }

      // send outcome User Added Tag
      const tagOutcome = await OneSignal.Session.sendOutcome("user_added_tag");
      console.log(tagOutcome, "Tag Outcome")

      const form = document.getElementById("tagForm");
      form.reset();
    });
  } else {
    console.warn("Add Tag Submit button not found.");
  }

  // Add FirstName and LastName for more current user Aliases
  const addFirstAndLastNameBtn = document.getElementById(
    "addFirstAndLastNameBtn"
  );
  if (addFirstAndLastNameBtn) {
    addFirstAndLastNameBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let firstName = document.getElementById("firstName").value;
      let lastName = document.getElementById("lastName").value;

      if (firstName || lastName) {
        const addAliases = await OneSignal.User.addAliases({
          firstName: firstName,
          lastName: lastName,
        });
        console.log(addAliases, "Added Aliases");
      }

      // send outcome User Added FirstName/LastName Aliases
      const nameAliasesOutcome = await OneSignal.Session.sendOutcome("user_added_aliases");
      console.log(nameAliasesOutcome, "Name Aliases Outcome")

      const form = document.getElementById("nameForm");
      form.reset();
    });
  } else {
    console.warn("Add Name Aliases Submit button not found.");
  }

  // Download Btn Send Outcome
  const downloadBtn = document.getElementById(
    "downloadBtn"
  );
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // send outcome to count how many user click download
      const downloadOutcome = await OneSignal.Session.sendOutcome("user_download");
      console.log(downloadOutcome, "Download Outcome")
    });
  } else {
    console.warn("Download button not found.");
  }
});
