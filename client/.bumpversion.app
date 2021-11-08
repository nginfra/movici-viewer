[bumpversion]
current_version = 1.22.18
allow_dirty = True

[bumpversion:file:VERSION]

[bumpversion:file:./chart/Chart.yaml]
search = appVersion: {current_version}
replace = appVersion: {new_version}
