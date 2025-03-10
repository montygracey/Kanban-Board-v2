import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import { retrieveUsers } from '../api/userAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { ApiMessage } from '../interfaces/ApiMessage';

import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  
  // Sort & Filter states
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve users:', err);
    }
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // Apply sorting and filtering
  useEffect(() => {
    if (tickets.length > 0) {
      let result = [...tickets];
      
      // Apply filters
      if (statusFilter !== 'all') {
        result = result.filter(ticket => ticket.status === statusFilter);
      }
      
      if (userFilter !== null) {
        result = result.filter(ticket => ticket.assignedUserId === userFilter);
      }
      
      if (searchText.trim() !== '') {
        const searchLower = searchText.toLowerCase();
        result = result.filter(
          ticket => 
            (ticket.name && ticket.name.toLowerCase().includes(searchLower)) || 
            (ticket.description && ticket.description.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply sorting
      result.sort((a, b) => {
        let valA, valB;
        
        if (sortField === 'name') {
          valA = a.name || '';
          valB = b.name || '';
        } else if (sortField === 'status') {
          valA = a.status || '';
          valB = b.status || '';
        } else if (sortField === 'assignee') {
          valA = a.assignedUser?.username || '';
          valB = b.assignedUser?.username || '';
        } else {
          return 0;
        }
        
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredTickets(result);
    }
  }, [tickets, sortField, sortOrder, statusFilter, userFilter, searchText]);

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
      fetchUsers();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            <div className='board-controls'>
              <button type='button' id='create-ticket-link'>
                <Link to='/create'>New Ticket</Link>
              </button>
              
              {/* Sort Controls */}
              <div className='sort-controls'>
                <label htmlFor='sort-field'>Sort by:</label>
                <select 
                  id='sort-field' 
                  value={sortField} 
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value='name'>Name</option>
                  <option value='status'>Status</option>
                  <option value='assignee'>Assignee</option>
                </select>
                
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <option value='asc'>Ascending</option>
                  <option value='desc'>Descending</option>
                </select>
              </div>
              
              {/* Filter Controls */}
              <div className='filter-controls'>
                <label htmlFor='status-filter'>Filter by status:</label>
                <select 
                  id='status-filter' 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value='all'>All Statuses</option>
                  {boardStates.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <label htmlFor='user-filter'>Filter by assignee:</label>
                <select 
                  id='user-filter' 
                  value={userFilter || ''} 
                  onChange={(e) => setUserFilter(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value=''>All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id || ''}>{user.username}</option>
                  ))}
                </select>
                
                <input 
                  type='text' 
                  placeholder='Search tickets...' 
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)} 
                />
              </div>
            </div>
            
            <div className='board-display'>
              {boardStates.map((status) => {
                const statusTickets = statusFilter === 'all' 
                  ? filteredTickets.filter(ticket => ticket.status === status)
                  : filteredTickets;
                
                return (
                  <Swimlane 
                    title={status} 
                    key={status} 
                    tickets={statusTickets} 
                    deleteTicket={deleteIndvTicket}
                  />
                );
              })}
            </div>
          </div>
        )
    }
    </>
  );
};

export default Board;