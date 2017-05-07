var gulp = require("gulp");
	tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    flatmap = require("gulp-flatmap");
    gutil = require("gulp-util");

// build variables
var _fileList,
	_buildFolder = "build";

// grabs file name from path (trims extension)
function getFileName(filepath)
{
	var file = filepath.replace(/\//g, "\\")
	file = file.substring(file.lastIndexOf("\\") + 1);
	return file.substring(0, file.indexOf("."));
}

// formats a changelog section
function changelogFormat(name, arr)
{
	if (!arr || arr.length === 0)
	{
		return '';
	}

	const newLine = "\n *   * ";
	name = `\n * - ${name.toUpperCase()}`;

	array.forEach( (text, i, list) => {
		name += `${newLine}${text}`;
	});

	return name;
}

// builds the js plugin file
function buildJsFile(stream, file)
{
	var name = getFileName(file.path);
	var data = _fileList[name];
	var path = file.path.replace("plugins/src", _buildFolder);

	if (!data)
	{
		return stream;
	}

	// build changelog
	var changelog = "";
	const newLine = "\n * ";
	data.meta.changelog.forEach( (v, i, list) => {
		changelog += `${newLine}${v.version} | ${v.date}`;
		changelog += changelogFormat(v.fixes);
		changelog += changelogFormat(v.features);
		changelog += changelogFormat(v.notes);
		changelog += "\n";
	});


	// build file
	var contents;

	gulp.src("plugins/meta/template.txt")
	.pipe(flatmap(function(str, f)
	{
		// modify template
		contents = f.contents.toString("utf8")
			.replace("{plugin-name_internal}", data.meta.name_internal)
			.replace("{plugin-name}", data.meta.name)
			.replace("{plugin-changelog}", changelog);

		// add other docs
		if (data.docs)
		{
			contents += `\n${data.docs}`;
		}

		// add js body
		contents += "\n" + file.contents.toString("utf8");

		// write file
		return string_src(path, contents)
			.pipe(gulp.dest(""));
	}));

	return stream;
}

// save file
function string_src(filename, content)
{
	var src = require('stream').Readable({ objectMode: true });
	src._read = function ()
	{
		this.push(new gutil.File({
			cwd: "",
			base: "",
			path: filename,
			contents: new Buffer(content)
		}));
		this.push(null);
	}
	return src;
}


// linting task
gulp.task("lint", function()
{
    return gulp.src("plugins/src/**/**.ts")
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
});

// transpiles source to javascript
gulp.task("build-plugins", ["_getFileList"], function()
{
	var tsProject = tsc.createProject("tsconfig.json");
    return gulp.src("plugins/src/**/**.ts")
        // transpile to js
        .pipe(tsProject()).js
		.pipe(flatmap(buildJsFile));
});

// generates file list based on meta files
// plugins won't be built without the meta file!
gulp.task("_getFileList", ["lint"], function()
{
	_fileList = {};
	
	return gulp.src("plugins/meta/**.json")
	.pipe(flatmap(function(stream, file)
	{
		var name = getFileName(file.path);
		var data = {
			meta: JSON.parse(file.contents.toString("utf8"))
		};

		_fileList[name] = data;

		return gulp.src(`plugins/docs/${name}.txt`)
			.pipe(flatmap(function(stream, file)
			{
				var docs = file.contents.toString("utf8");
				docs = docs.replace("{plugin-header}", `@author S_Rank_Crazy\n * @plugindesc ${data.meta.version.develop} ${data.meta.description}\n * <SRCrazy_${data.meta.name_internal}>`);

				data["docs"] = docs;
				return stream;
			}));
	}));
});

