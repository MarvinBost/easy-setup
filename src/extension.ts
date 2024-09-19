// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {exec} from "child_process";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createProject",
    async () => {
      // Check if npm is installed
      exec("npm -v", (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(
            "NPM is not installed. Please install NPM first."
          );
          return;
        }
      });

      // Check if create-vite is installed
      exec("npm list -g create-vite", (err, stdout, stderr) => {
        if (err) {
          exec("npm install -g create-vite", (err, stdout, stderr) => {
            if (err) {
              vscode.window.showErrorMessage(
                "Error: Unable to install create-vite."
              );
              return;
            }
          });
        }
      });

      // Check if a folder is open
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage(
          "Please open a folder before creating a project."
        );
        return;
      }

      // Select the type of project to create
      await selectProjectType();
    }
  );

  context.subscriptions.push(disposable);
}

export async function selectProjectType() {
  const projectType = await vscode.window.showQuickPick(
    ["Frontend", "Backend", "Fullstack"],
    {placeHolder: "Select the type of project to create"}
  );

  if (!projectType) {
    return;
  }

  switch (projectType) {
    case "Frontend":
      await selectStack("Frontend");
      break;
    case "Backend":
      await selectStack("Backend");
      break;
    case "Fullstack":
      await selectStack("Fullstack");
      break;
  }
}

export async function selectStack(type: string) {
  switch (type) {
    case "Frontend":
      const frontendStack = await vscode.window.showQuickPick(
        ["React", "Vue", "Angular", "HTML (static)", "Next.js"],
        {placeHolder: "Select the frontend stack"}
      );
      if (!frontendStack) {
        return;
      }
      await createProject(frontendStack);
      break;
    case "Backend":
      const backendStack = await vscode.window.showQuickPick(
        ["NestJS", "AdonisJS", "Express"],
        {placeHolder: "Select the backend stack"}
      );
      if (!backendStack) {
        return;
      }
      await createProject(backendStack);
      break;
    case "Fullstack":
      const fullstackStack = await vscode.window.showQuickPick(
        [
          "Next.js",
          "React-NestJS",
          "Vue-NestJS",
          "Angular-NestJS",
          "HTML-NestJS",
          "React-AdonisJS",
          "Vue-AdonisJS",
          "Angular-AdonisJS",
          "HTML-AdonisJS",
          "React-Express",
          "Vue-Express",
          "Angular-Express",
          "HTML-Express",
        ],
        {placeHolder: "Select the fullstack stack"}
      );
      if (!fullstackStack) {
        return;
      }
      await createProject(fullstackStack);
      break;
  }
}

export async function createProject(technology: string) {
  const projectName = await vscode.window.showInputBox({
    placeHolder: "Enter the project name",
  });

  if (!projectName) {
    return;
  }
  const urlWorkspace = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const isTypescript =
    technology !== "Angular"
      ? await vscode.window.showQuickPick(["Yes", "No"], {
          placeHolder: "Do you want to use Typescript?",
        })
      : "Yes";
  if (!isTypescript) {
    return;
  }
  switch (technology) {
    case "React":
      vscode.window.showInformationMessage("Creating React project...");
      exec(
        `cd ${urlWorkspace} && create-vite ${projectName} --template ${
          isTypescript === "Yes" ? "react-ts" : "react"
        }`,
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Error: Unable to create React project."
            );
            return;
          }
          vscode.window.showInformationMessage(
            "React project created successfully."
          );
        }
      );
      break;
    case "Vue":
      vscode.window.showInformationMessage("Creating Vue project...");
      exec(
        `cd ${urlWorkspace} && create-vite ${projectName} --template ${
          isTypescript === "Yes" ? "vue-ts" : "vue"
        }`,
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Error: Unable to create Vue project."
            );
            return;
          }
          vscode.window.showInformationMessage(
            "Vue project created successfully."
          );
        }
      );
      break;
    case "Angular":
      vscode.window.showInformationMessage("Creating Angular project...");

      // Check if Angular CLI is installed
      exec("ng --version", (err, stdout, stderr) => {
        if (err) {
          exec("npm install -g @angular/cli", (err, stdout, stderr) => {
            if (err) {
              vscode.window.showErrorMessage(
                "Angular CLI is not installed. Please install Angular CLI first. \n `npm install -g @angular/cli`"
              );
              return;
            }
          });
          return;
        }
      });

      exec(
        `cd ${urlWorkspace} && ng new ${projectName} --minimal --skip-install`,
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Error: Unable to create Angular project."
            );
            return;
          }
          vscode.window.showInformationMessage(
            "Angular project created successfully."
          );
        }
      );
      break;
    case "HTML (static)":
      vscode.window.showInformationMessage("Creating HTML project...");
      exec(
        `cd ${urlWorkspace} && mkdir ${projectName}`,
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Error: Unable to create HTML project."
            );
            return;
          }

          // TODO: Create index.html file and add basic HTML structure and CSS file and JS file and folder structure and git init

          vscode.window.showInformationMessage(
            "HTML project created successfully."
          );
        }
      );
      break;
    case "Next.js":
      vscode.window.showInformationMessage("Creating Next.js project...");
      //npx create-next-app@latest --example [example-name] [your-project-name]
      // Typescript or not

      // ESLint or not
      const isESLint = await vscode.window.showQuickPick(["Yes", "No"], {
        placeHolder: "Do you want to use ESLint?",
      });

      if (!isESLint) {
        return;
      }

      // Npm, Yarn or PNPM
      const packageManager = await vscode.window.showQuickPick(
        ["npm", "yarn", "pnpm"],
        {
          placeHolder: "Select the package manager",
        }
      );

      if (!packageManager) {
        return;
      }

      // Tailwind CSS or not
      const isTailwind = await vscode.window.showQuickPick(["Yes", "No"], {
        placeHolder: "Do you want to use Tailwind CSS?",
      });

      if (!isTailwind) {
        return;
      }

      exec(
        `cd ${urlWorkspace} && npx create-next-app@latest ${projectName} --app --no-src-dir --import-alias "@/*" ${
          isTypescript === "Yes" ? "--ts" : "--js"
        } ${isESLint === "Yes" ? "--eslint" : "--no-eslint"} ${
          isTailwind === "Yes" ? "--tailwind" : "--no-tailwind"
        }
		--use-` + packageManager,
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              "Error: Unable to create Next.js project."
            );
            return;
          }
          vscode.window.showInformationMessage(
            "Next.js project created successfully."
          );
        }
      );

      break;
    case "NestJS":
      vscode.window.showInformationMessage("Creating NestJS project...");
      break;
    case "AdonisJS":
      vscode.window.showInformationMessage("Creating AdonisJS project...");
      break;
    case "Express":
      vscode.window.showInformationMessage("Creating Express project...");
      break;
    case "React-NestJS":
      vscode.window.showInformationMessage("Creating React-NestJS project...");
      break;
    case "Vue-NestJS":
      vscode.window.showInformationMessage("Creating Vue-NestJS project...");
      break;
    case "Angular-NestJS":
      vscode.window.showInformationMessage(
        "Creating Angular-NestJS project..."
      );
      break;
    case "HTML-NestJS":
      vscode.window.showInformationMessage("Creating HTML-NestJS project...");
      break;
    case "React-AdonisJS":
      vscode.window.showInformationMessage(
        "Creating React-AdonisJS project..."
      );
      break;
    case "Vue-AdonisJS":
      vscode.window.showInformationMessage("Creating Vue-AdonisJS project...");
      break;
    case "Angular-AdonisJS":
      vscode.window.showInformationMessage(
        "Creating Angular-AdonisJS project..."
      );
      break;
    case "HTML-AdonisJS":
      vscode.window.showInformationMessage("Creating HTML-AdonisJS project...");
      break;
    case "React-Express":
      vscode.window.showInformationMessage("Creating React-Express project...");
      break;
    case "Vue-Express":
      vscode.window.showInformationMessage("Creating Vue-Express project...");
      break;
    case "Angular-Express":
      vscode.window.showInformationMessage(
        "Creating Angular-Express project..."
      );
      break;
    case "HTML-Express":
      vscode.window.showInformationMessage("Creating HTML-Express project...");
      break;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
