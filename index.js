
const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
var myEmail;
var myPicture;
var projectData;


function promptUser() {

 return inquirer.prompt([
    {
      type: "input",
      name: "userName",
      message: "Enter your GitHub Username"
    },
    // {
    //   type: "input",
    //   name: "password",
    //   message: "Enter your GitHub Password?"
    // },
    {
      type: "input",
      name: "projectTitle",
      message: "What is the Title of your project?"
    },
    {
      type: "input",
      name: "Description",
      message: "Please enter a Description of your project?"
    },
    {
      type: "editor",
      name: "tableOfContents",
      message: "Type your Table Of contents?"
    },
    {
      type: "input",
      name: "projectInstallation",
      message: "Installation."
    },
    {
      type: "input",
      name: "usage",
      message: "What is the usage of your project?"
    },
    {
      type: "input",
      name: "license",
      message: "Please enter the license of your project?"
    },
    {
      type: "input",
      name: "contributing",
      message: "Who is the contributing party?"
    },
    {
      type: "input",
      name: "test",
      message: "What type of testing was done."
    }

  ])

    .then(function (iData) {
      projectData = iData;
      const queryUrl = `https://api.github.com/users/${iData.userName}/events/public`;
      return axios.get(queryUrl);
    
    });
};

function generateReadMe(data) {
  return `
<!DOCTYPE readme.md>;
Project title ${data.projectTitle}
A little info about your project and/ or overview that explains what the project is about.
${data.Description}

Table Of Contents
${data.tableOfContents}

Build status
Build status of continus integration i.e. travis, appveyor etc. Ex. -

Build Status Windows Build Status

Code style
If you're using any code style like xo, standard etc. That will help others while contributing to your project. Ex. -

js-standard-style

Screenshots
Include logo/demo screenshot etc.

Tech/framework used
Ex. -

Built with

Electron
Features
What makes your project stand out?

Code Example
Show what the library does as concisely as possible, developers should be able to figure out how your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

Installation
Provide step by step series of examples and explanations about how to get a development env running.
${data.projectInstallation}

API Reference
queryUrl = "https://api.github.com/users/GIT-HUB-USERS-NAME/events/public";

Tests
Describe and show how to run the tests with code examples.
${data.test}

How to use?
If people like your project they’ll want to learn how they can use it. To do so include step by step guide to use your project.
${data.usage}

Contribute
Let people know how they can contribute into your project. A contributing guideline will be a big plus.
${data.contributing}

Credits
Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project.

Anything else that seems useful
License
A short snippet describing the license (MIT, Apache etc)
${data.license}

SMU © ${data.userName}

${data.myPicture}
${data.myEmail}


`

};

// SMU © ${data.userName}
// E-mail `myEmail`
// `myPicture` 


async function init() {
  console.log("init");
  try {
    const githubApiResponse = await promptUser();
    console.log("projectData", projectData);
    console.log("github", githubApiResponse)
    projectData.myEmail = githubApiResponse.data[0].payload.commits[0].author.email;
    projectData.myPicture = githubApiResponse.data[0].actor.avatar_url;
    const html = await generateReadMe(projectData);
    console.log("generateReadMe");
    await writeFileAsync("README.md", html);

    console.log("Successfully wrote to Readme.md");
  } catch (err) {
    console.log(err);
  }
}

init();
