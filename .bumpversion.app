[bumpversion]
current_version = 0.3.2
allow_dirty = True

[bumpversion:file:VERSION]

[bumpversion:file:client/package.json]
search = "version": "{current_version}",
replace = "version": "{new_version}",

[bumpversion:file:server/pyproject.toml]
search = version = "{current_version}"
replace = version = "{new_version}"
