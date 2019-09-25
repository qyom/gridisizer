var params = {
    "serverUrl": "/admin/designers/ajax-fetch-designers",
    "dataContainer": $("#data-container"),
    "baseParams": {}
};
grid = new QyomGrid(params);
grid.renderData();