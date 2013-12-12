var markdox = require('markdox');
var parseTagTypes = function(str) {
  return str
    .replace(/[{}]/g, '')
    .split(/ *[|,\/] */);
};
function getOptions(args) {
    var REGEPX = /^-/;
    var options = {};
    var index = 0;
    var opt;
    while(opt = args[index++] ){
        if( REGEPX.test(opt) ){
            options[args.shift()] = args.shift();
            --index;
        }
    }
    return options;
}

var args = process.argv.splice(2);
var options = getOptions(args);

var options = {
    output: options['-o'] || 'documentation.md',
    formatter: function(docfile){
        docfile.javadoc.forEach(function(javadoc, index){
            javadoc.tag = javadoc.tag || { option:[] };
            javadoc.raw.tags.forEach(function(tag){
                var string =tag.string || '';
                var parts = string.split(/ +/);
                if (tag.type == 'option' || tag.type == 'event'){


                    tag.types = parseTagTypes( parts.shift() || '' ).join(', ');
                    tag.name = parts.shift();


                    if (tag.type == 'option'){
                        tag.default = parts.shift();
                    }
                    tag.description = parts.join(' ');
                };

                if(tag.type){
                    if(!javadoc.tag[tag.type]) javadoc.tag[tag.type] = [];
                    javadoc.tag[tag.type].push(tag);
                }

            });
            //console.log(javadoc.tag);
        });
        return docfile;
    },
    template: options['-t'] ||  __dirname + '/components_doc.ejs'
};

markdox.process(args, options, function(){
  console.log('Documentation generated in "'+options.output+'"');
});
