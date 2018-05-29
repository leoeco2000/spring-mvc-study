
/**
 * タスク実行管理クラス
 * インスタンス生成にはTaskManger.createを使用する。
 * @constructor
 */
function TaskManager()
{
    this.tasks = [];
}

/**
 * タスクを追加する。
 * @param method タスクとして実行するメソッド
 * @param context メソッドの実行コンテキスト
 *     省略時はコンテキストを指定せずにメソッドを実行する。
 */
TaskManager.prototype.addTask = function(method, opt_context)
{
    var task = { 'context': opt_context, 'method': method };
    this.tasks.push(task);
};

/**
 * タスクを直列的に実行する。
 * @param params 各メソッドに渡されるパラメータオブジェクト
 */
TaskManager.prototype.seriallyExecute = function(params)
{
    params = params || {};
    params.executeSuccess = true;
    var param = _.isArray(params) ? params : [params];

    var defer = $.Deferred();
    var last = function(e)
    {
        params.executeSuccess ? defer.resolve(e) : defer.reject(e);
    };
    if(this.tasks.length == 0){
        return defer.resolve().promise();
    };
    _.reduceRight(this.tasks, function(next, current) {
        return _.bind(function() {
            var promise = current.method.apply(current.context, param);
            if (!promise || !promise.done) {
                promise = $.Deferred().resolve().promise();
            }
            next = next || last;
            promise.done(function(e) {
                next(e);
            }).fail(function(e) {
                params.executeSuccess = false;
                last(e);
            });
        }, this);
    }, null, this)();
    return defer.promise();
};

/**
 * タスクを並列的に実行する。
 * @param params 各メソッドに渡されるパラメータオブジェクト
 */
TaskManager.prototype.parallellyExecute = function(params)
{
    params = params || {};
    var param = _.isArray(params) ? params : [params];
    if(this.tasks.length == 0){
        return $.Deferred().resolve().promise();
    };
    var promises = $.map(this.tasks, function(task) {
        var promise = task.method.apply(task.context, param);
        if (!promise || !promise.done) {
            promise = $.Deferred().resolve().promise();
        }
        return promise;
    });

    var defer = $.Deferred();
    $.when.apply(null, promises).done(function() {
        defer.resolve();
    }).fail(function(e) {
        defer.reject(e);
    });
    return defer.promise();
};


/**
 * タスク実行管理インスタンスを生成する。
 * @returns {TaskManager} タスク実行管理
 */
TaskManager.create = function()
{
    return new TaskManager();
};