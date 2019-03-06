/*-
 * #%L
 * Arcade Analytics
 * %%
 * Copyright (C) 2018 - 2019 ArcadeAnalytics
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from './company-detail.component';
import { CompanyPopupComponent } from './company-dialog.component';
import { CompanyDeletePopupComponent } from './company-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class CompanyResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const companyRoute: Routes = [
    {
        path: 'company',
        component: CompanyComponent,
        resolve: {
            'pagingParams': CompanyResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'arcadeanalyticsApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company/:id',
        component: CompanyDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'arcadeanalyticsApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyPopupRoute: Routes = [
    {
        path: 'company-new',
        component: CompanyPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'arcadeanalyticsApp.company.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company/:id/edit',
        component: CompanyPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'arcadeanalyticsApp.company.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company/:id/delete',
        component: CompanyDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'arcadeanalyticsApp.company.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
