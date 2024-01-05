module.exports = {
  "apps" : [
     {
        "name"          : "CXperts-portal",
        "script"        : "./node_modules/next/dist/bin/next",
        "args"          : "start -p 3000",
        "cwd"           : ".",
        "instances"     : 1,
        "exec_mode"     : "cluster"
     }
  ]
}
