import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/**
 * [x] Recebimento das informações
 * [x] Tratativas de erros/excessões
 * [x] Aceeso ao repositório
 */

interface Request {
  provider: string;
  date: Date;
}

/**
 * Dependency Inversion (SOLID)
 *
 * Aqui será aplicada a regra de negócio para criar um agendamento
 * Toda regra de negócio deverá ter apenas uma única responsabilidade,
 * com um método para executar esta regra
 */

class CreateAppointmentService {
  private appointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked.');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
