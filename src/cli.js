import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

async function promptForMissingOptions() {
  const questions = [];
  questions.push({
	type: 'input',
	name: 'title',
	message: 'title of the new article, e.g. "Language Models in 2020"',
  });
  questions.push({
	type: 'input',
	name: 'tags',
	message: 'Input comma separate tags for this article, e.g "programming,music"',
  });
  questions.push({
	type: 'input',
	name: 'old_website',
	message: 'Do you want to move this article from old website? leave empty for no or e.g. "http://www.lessand.ro/17/post"',
  });

  const answers = await inquirer.prompt(questions);
  return {
    tags: answers.tags,
    old_website: answers.old_website,
    title: answers.title,
  };
}

export async function cli(args) {
  try {
	var options = await promptForMissingOptions();
	await createProject(options);
  } catch (e) {
	console.log(e);
  }
}
