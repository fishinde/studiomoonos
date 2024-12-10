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
        serviceWorkerParam: { scope: "/studiomoonos/" },
        serviceWorkerPath: "/studiomoonos/js/onesignal/OneSignalSDKWorker.js",
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

      const emailTrim = email.trim();
      const nameTrim = name.trim();
      const phoneTrim = phone.trim();

      if (!emailTrim || !nameTrim || !phoneTrim) {
        alert("Please enter required fields");
        return;
      }

      OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.login(emailTrim); // initiate login first

        await OneSignal.User.addEmail(emailTrim);
        console.log("Registered Email", emailTrim);

        await OneSignal.User.addAlias("name", nameTrim);
        console.log("Registered Name", nameTrim);

        await OneSignal.User.addSms(`+${phoneTrim}`);
        console.log("Registered Phone", phoneTrim);

        // send outcome User registered
        await OneSignal.Session.sendOutcome("user_registered");

        const form = document.getElementById("registerForm");
        form.reset();
        const registerModal = document.getElementById("registerModal");
        const modal = bootstrap.Modal.getInstance(registerModal);
        modal.hide();
        document.querySelector("#loginBtn").classList.add("d-none");
        document.querySelector("#registerBtn").classList.add("d-none");
        document.querySelector("#logoutBtn").classList.remove("d-none");
      });
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
      const emailTrim = email.trim();
      if (emailTrim) {
        OneSignalDeferred.push(async function (OneSignal) {
          // login with email as external_id
          await OneSignal.login(emailTrim);
          await OneSignal.User.addEmail(emailTrim);
          console.log("Logged In User Account", emailTrim);

          // send outcome User Logged in
          await OneSignal.Session.sendOutcome("user_logged_in");
          const form = document.getElementById("loginForm");
          form.reset();
          const loginModal = document.getElementById("loginModal");
          const modal = bootstrap.Modal.getInstance(loginModal);
          modal.hide();
          document.querySelector("#loginBtn").classList.add("d-none");
          document.querySelector("#registerBtn").classList.add("d-none");
          document.querySelector("#logoutBtn").classList.remove("d-none");
        });
      } else {
        alert("Please enter email to login");
      }
    });
  } else {
    console.warn("Login button not found.");
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.logout();
        console.log("User signed out.");
        document.querySelector("#logoutBtn").classList.add("d-none");
        document.querySelector("#loginBtn").classList.remove("d-none");
        document.querySelector("#registerBtn").classList.remove("d-none");
      });
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

      if (tagKey && tagValue) {
        OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.User.addTag(tagKey, tagValue);
          console.log("Tag Key", tagKey);
          console.log("Tag Value", tagValue);
          // send outcome User Added Tag
          await OneSignal.Session.sendOutcome("user_added_tag");
          const form = document.getElementById("tagForm");
          form.reset();
        });
      } else {
        alert("Please enter both tag key and value");
      }
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

      if (firstName && lastName) {
        OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.User.addAliases({
            firstName: firstName,
            lastName: lastName,
          });
          console.log(firstName, "First Name");
          console.log(lastName, "Last Name");

          // send outcome User Added FirstName/LastName Aliases
          await OneSignal.Session.sendOutcome("user_added_aliases");

          const form = document.getElementById("nameForm");
          form.reset();
        });
      } else {
        alert("Please enter both firstname and lastname");
      }
    });
  } else {
    console.warn("Add Name Aliases Submit button not found.");
  }

  // Download Btn Send Outcome
  const downloadBtns = document.getElementsByClassName("downloadBtn");
  if (downloadBtns) {
    downloadBtns.forEach((downloadBtn) => {
      downloadBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // send outcome to count how many user click download
        OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.Session.sendOutcome("user_download");
          console.log("download button clicked");
        });
      });
    });
  } else {
    console.warn("Download button not found.");
  }
});
