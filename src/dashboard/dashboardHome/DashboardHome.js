import React from 'react';
import ManagementCostChart from './ManegmentsCostChart';
import useTitle from '../../shared/useTitle/useTitle';


const DashboardHome = () => {
    useTitle('Home')
    return (
        <div>
           <ManagementCostChart></ManagementCostChart>
        </div>
    );
}

export default DashboardHome;