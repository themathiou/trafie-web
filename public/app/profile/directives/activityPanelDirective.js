angular.module('trafie')
    .directive('activityPanel', function () {
        function link(scope, element, attrs) {
        }

        return {
            restrict: 'EA',
            replace: true,
            scope: false,
            link: link,
            template:
                `<div class="panel panel-default">
                    <div class="panel-body">
                        <div class="activity-lead full-inline-block">
                            <div class="row">
                                <div class="col-sm-9 p-right-30">
                                    <strong class="lead" ng-bind-html="activity.getReadablePerformance()"></strong>
                                    <strong class="lead">&bull;  {{activity.competition}}</strong>
                                    <span>
                                        <small class="text-muted" translate="{{'DISCIPLINES.' + activity.discipline.toUpperCase()}}"></small>&nbsp;
                                        <small class="text-muted">{{(activity.isOutdoor ? 'PROFILE.OUTDOOR' : 'PROFILE.INDOOR') | translate}}</small>
                                    </span>
                                </div>
                                <div class="col-sm-3">
                                    <span class="pull-sm-right" ng-class="{'m-right-15': ownProfile}">
                                        {{formatUnixTimestamp(activity.date)}}
                                    </span>
                                </div>
                            </div>
                            <span uib-dropdown class="activity-options" on-toggle="toggled(open)" ng-if="ownProfile">
                                <a href uib-dropdown-toggle>
                                    <i class="fa fa-ellipsis-v text-muted"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu>
                                    <li class="hide">
                                        <a href="javascript:;">
                                            <i class="fa fa-external-link text-primary"></i>&nbsp;
                                            {{'COMMON.SHARE' | translate}}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:;" ng-click="openActivityEditorModal(activity)">
                                            <i class="fa fa-edit text-warning"></i>&nbsp;
                                            {{'COMMON.EDIT' | translate}}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:;" ng-click="deleteActivity(activity)" confirm="{{'PROFILE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ACTIVITY' | translate}}" confirm-title="{{'PROFILE.DELETE_ACTIVITY' | translate}}" confirm-ok="{{'COMMON.YES' | translate}}" confirm-cancel="{{'COMMON.CANCEL' | translate}}" confirm-settings="{size: 'sm'}">
                                            <i class="fa fa-remove text-danger"></i>&nbsp;
                                            {{"COMMON.DELETE" | translate}}
                                        </a>
                                    </li>
                                </ul>
                            </span>
                        </div>
                        <div class="col-xs-12 activity-picture-wrapper" ng-if="activity.picture">
                            <img ng-src="{{activity.getPicture('md')}}" class="activity-picture">
                        </div>
                        <div>
                            <div ng-if="activity.location">
                                <b translate="PROFILE.LOCATION"></b>:
                                <span>{{activity.location}}</span>
                            </div>
                            <div ng-if="activity.rank">
                                <b translate="PROFILE.RANK"></b>:
                                <span>{{activity.rank}}</span>
                            </div>
                            <div ng-if="activity.comments">
                                <b translate="PROFILE.COMMENTS"></b>:
                                <span>{{activity.comments}}</span>
                            </div>
                            <div ng-if="activity.notes">
                                <b translate="PROFILE.NOTES"></b>:
                                <span>{{activity.notes}}</span>
                            </div>
                        </div>
                    </div>
                </div>`
        }
    });