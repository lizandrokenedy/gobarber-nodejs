import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
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
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked.');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
