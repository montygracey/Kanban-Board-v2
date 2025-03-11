import { Request, Response } from 'express';
import { Ticket } from '../models/ticket.js';
import { User } from '../models/user.js';

// GET /tickets
export const getAllTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: 'assignedUser', // This should match the alias defined in the association
          attributes: ['username'], // Include only the username attribute
        },
      ],
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tickets/:id
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser', // This should match the alias defined in the association
          attributes: ['username'], // Include only the username attribute
        },
      ],
    });
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /tickets
export const createTicket = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, status, description, assignedUserId } = req.body;
  console.log('Creating ticket with data:', req.body);
  
  try {
    // Validate the assignedUserId exists
    if (assignedUserId) {
      const user = await User.findByPk(assignedUserId);
      if (!user) {
        console.log(`User ID ${assignedUserId} not found`);
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }
    
    const newTicket = await Ticket.create({ name, status, description, assignedUserId });
    console.log('Ticket created successfully:', newTicket.id);
    return res.status(201).json(newTicket);
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return res.status(400).json({ message: error.message });
  }
};

// PUT /tickets/:id
export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, description, assignedUserId } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      ticket.name = name;
      ticket.status = status;
      ticket.description = description;
      ticket.assignedUserId = assignedUserId;
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /tickets/:id
export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      await ticket.destroy();
      res.json({ message: 'Ticket deleted' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
