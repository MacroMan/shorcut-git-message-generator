const getStoryId = () => {
  return document.querySelector(".story-id input").value;
};

const getTechnicalArea = () => {
  const el = Array.from(
    document.body.querySelector(".story-attributes").querySelectorAll("*"),
  ).find((elm) => elm.textContent === "Technical Area");

  return el?.nextElementSibling?.innerText;
};

const getStoryName = () => {
  return document.querySelector(".story-name").textContent;
};

const getCommitMessage = () => {
  const technicalArea = getTechnicalArea();
  const storyId = getStoryId();
  const storyName = getStoryName();

  if (!technicalArea || technicalArea === "None") {
    return;
  }

  return `[${technicalArea}-${storyId}] ${storyName}`;
};

const stringToHtml = (string) => {
  const template = document.createElement("template");
  template.innerHTML = string;

  return template.content.children[0];
};

const createLabelElement = () => {
  return stringToHtml("<p>Commit message</p>");
};

const createWarningElement = () => {
  return stringToHtml(
    `<p style="color: #ff6a6a;">Warning! Missing "Technical Area" field, cannot generate commit message</p>`,
  );
};

const createCommitMessageElement = (commitMessage) => {
  return stringToHtml(
    `
      <div class="attribute-group">
        <div class="attribute-toggle">
          <a href="#" class="clipboard" data-clipboard-target=".git-commit-message" data-tooltip="Copy to clipboard" data-tabindex="" tabindex="2">
            <span class="fa fa-clipboard" />
          </a>
        </div>
        <div class="attribute attribute-has-toggle">
          <input class="git-commit-message" data-on-click="App.Utils.selectText" type="text" readonly value="${commitMessage}">
        </div>    
      </div>
    `,
  );
};

const appendElement = (element) => {
  document.getElementById("link-to-branch").appendChild(element);
};

const observer = new MutationObserver(() => {
  const dialog = document.querySelector(".git-branch-dialog");

  if (!dialog || dialog.textContent.includes("Commit message")) {
    return;
  }

  const commitMessage = getCommitMessage();

  appendElement(createLabelElement());

  appendElement(
    commitMessage
      ? createCommitMessageElement(commitMessage)
      : createWarningElement(),
  );
});

observer.observe(document.body, { childList: true, subtree: true });
