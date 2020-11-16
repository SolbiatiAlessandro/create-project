import chalk from 'chalk';
import execa from 'execa';
import gitignore from 'gitignore';
import Listr from 'listr';
import ncp from 'ncp';
import fs from 'fs';
import path from 'path';
import { projectInstall } from 'pkg-install';
import license from 'spdx-license-list/licenses/MIT';
import { promisify } from 'util';
import mkdirp from 'mkdirp';
import Mustache from 'mustache'
import request from 'request';
import cheerio from 'cheerio';
import TurndownService from 'turndown';

function get_date(){
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  return year + "-" + month + "-" + date;
}

function format_title(title) {
  return title.toLocaleLowerCase().split(" ").join("-")
}

export async function createProject(options) {
  options = {
    ...options,
	date: get_date(),
  };

  console.log(options)
  const formatted_title = format_title(options.title)
  const folder = "content/posts/" + formatted_title
  var content = `---
title: {{title}}
date: {{date}}
tags:`
  var populated_content = Mustache.render(content, options)
  options.tags.split(",").forEach( function(tag){
	populated_content += `\n  - `+tag
  })
  populated_content += '\n---\n\n'
  const filename = folder + "/index.mdx";

  mkdirp(folder, function(err) {
	fs.writeFile(filename, populated_content, function (err, file) {
	  if (err) throw err;
	  console.log('Saved1!');
	});
  });

  if (options.old_website) {
	request(options.old_website, { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  const $ = cheerio.load(res.body)
	  const old_article = $('.article_text').html();
	  var turndownService = new TurndownService();
	  var markdown = turndownService.turndown(old_article);
	  var markdown = markdown.replaceAll("\\>>>", "###");
	  var markdown = markdown.replaceAll("/static", "http://www.lessand.ro/static");
	  fs.appendFile(filename, markdown, function (err, file) {
		if (err) throw err;
		console.log('Saved2!');
	  });
	});
  }
}
