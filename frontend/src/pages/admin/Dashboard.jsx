import { Link } from 'react-router-dom';

const Dashboard = () => {
  const cards = [
    {
      title: 'Manage Products',
      description: 'Add, edit, and remove products',
      link: '/admin/products',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Manage Orders',
      description: 'View and update order statuses',
      link: '/admin/orders',
      color: 'bg-green-50 border-green-200',
    },
  ];

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Admin Dashboard</h1>

      <div className='grid md:grid-cols-2 gap-6'>
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`block p-6 rounded-xl border-2 ${card.color} hover:shadow-md transition`}
          >
            <h2 className='text-lg font-semibold text-gray-900'>
              {card.title}
            </h2>
            <p className='text-sm text-gray-600 mt-1'>{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
