export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/angular2-busy.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'ng2.busy',
	external:["@angular/core", "@angular/common", "rxjs/Subscription", "angular2-dynamic-component/index"],
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable',
		'rxjs/Subscription': 'Rx.Subscription',
		'angular2-dynamic-component/index': 'angular2-dynamic-component/index'
	}
}
