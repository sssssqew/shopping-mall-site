import DashboardMenu from '../components/DashboardMenu'
import { getOrders } from '../api';
import { changeDateFormat } from '../utils'

const OrderListScreen = {
  render: async () => {
    const orders = await getOrders();

    return `
      <div class="dashboard">
        ${DashboardMenu.render({selected: 'orders'})}
        <div class="dashboard-content">
          <h1>Orders</h1>
         
          <div class="product-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>USER</th>
                  <th>PAID AT</th>
                  <th>DELIVERED AT</th>
                  <th class="tr-action">ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(order => `
                  <tr>
                    <td>${order._id}</td>
                    <td>${changeDateFormat(order.createdAt)}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.user.name}</td>
                    <td>${order.paidAt || 'No'}</td>
                    <td>${order.deliveredAt || 'No'}</td>
                    <td>
                      <button id="${order._id}" class="edit-button">Edit</button>
                      <button id="${order._id}" class="delete-button">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }
}
export default OrderListScreen