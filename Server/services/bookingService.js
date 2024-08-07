const Booking = require("../models/Booking");
const Client = require("../models/Client");
const ArchivedBooking = require("../models/ArchivedBooking");
const ApiError = require("../exeptions/apiErrors");

class BookingService {
    async addBooking(booking) {
        if (booking.email) {
            const emailCandidate = await  Booking.findOne({'contacts.email': booking.email})
            if (emailCandidate) {
                throw ApiError.BadRequest(`The request for consultation for email ${booking.email} already exist`);
            }
        }

        if (booking.phone) {
            const phoneCandidate = await  Booking.findOne({'contacts.phone': booking.phone})
            if (phoneCandidate) {
                throw ApiError.BadRequest(`The request for consultation for phone ${booking.phone} already exist`);
            }
        }

        if (booking.whatsapp) {
            const whatsappCandidate = await  Booking.findOne({'contacts.whatsapp': booking.whatsapp})
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`The request for consultation for whatsapp ${booking.whatsapp} already exist`);
            }
        }

        return await Booking.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.email,
                phone: booking.phone,
                whatsapp: booking.whatsapp,
                messenger: booking.messenger?.trim(),
                insta: booking.insta?.trim(),
            },
            message: booking.message
        });
    }

    async archiveBooking(booking) {
        if (booking.contacts.email) {
            const emailCandidate = await  ArchivedBooking.findOne({'contacts.email': booking.contacts.email})
            if (emailCandidate) {
                throw ApiError.BadRequest(`The request for consultation for email ${booking.contacts.email} already exist`);
            }
        }

        if (booking.contacts.phone) {
            const phoneCandidate = await  ArchivedBooking.findOne({'contacts.phone': booking.contacts.phone})
            if (phoneCandidate) {
                throw ApiError.BadRequest(`The request for consultation for phone ${booking.contacts.phone} already exist`);
            }
        }

        if (booking.contacts.whatsapp) {
            const whatsappCandidate = await  ArchivedBooking.findOne({'contacts.whatsapp': booking.contacts.whatsapp})
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`The request for consultation for whatsapp ${booking.contacts.whatsapp} already exist`);
            }
        }

        return await ArchivedBooking.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.contacts.email,
                phone: booking.contacts.phone,
                whatsapp: booking.contacts.whatsapp,
                messenger: booking.contacts.messenger?.trim(),
                insta: booking.contacts.insta?.trim(),
            },
            message: booking.message
        });
    }

    async restoreBooking(booking) {
        if (booking.contacts.email) {
            const emailCandidate = await  Booking.findOne({
                'contacts.email': booking.contacts.email
            });
            if (emailCandidate) {
                throw ApiError.BadRequest(`The request for consultation for email ${booking.contacts.email} already exist`);
            }
        }

        if (booking.contacts.phone) {
            const phoneCandidate = await  Booking.findOne({
                'contacts.phone': booking.contacts.phone
            });
            if (phoneCandidate) {
                throw ApiError.BadRequest(`The request for consultation for phone ${booking.contacts.phone} already exist`);
            }
        }

        if (booking.contacts.whatsapp) {
            const whatsappCandidate = await  Booking.findOne({
                'contacts.whatsapp': booking.contacts.whatsapp
            });
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`The request for consultation for whatsapp ${booking.contacts.whatsapp} already exist`);
            }
        }


        return await Booking.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.contacts.email,
                phone: booking.contacts.phone,
                whatsapp: booking.contacts.whatsapp,
                messenger: booking.contacts.messenger?.trim(),
                insta: booking.contacts.insta?.trim(),
            },
            message: booking.message
        });
    }

    async bookingToClient(booking) {
        if (booking.contacts.email) {
            const emailCandidate = await  Client.findOne({
                'contacts.email': booking.contacts.email
            });
            if (emailCandidate) {
                throw ApiError.BadRequest(`Client with email ${booking.contacts.email} already exist`);
            }
        }

        if (booking.contacts.phone) {
            const phoneCandidate = await  Client.findOne({
                'contacts.phone': booking.contacts.phone
            });
            if (phoneCandidate) {
                throw ApiError.BadRequest(`Client with phone ${booking.contacts.phone} already exist`);
            }
        }

        if (booking.contacts.whatsapp) {
            const whatsappCandidate = await  Client.findOne({
                'contacts.whatsapp': booking.contacts.whatsapp
            });
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`Client with whatsapp ${booking.contacts.whatsapp} already exist`);
            }
        }


        return await Client.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.contacts.email,
                phone: booking.contacts.phone,
                whatsapp: booking.contacts.whatsapp,
                messenger: booking.contacts.messenger?.trim(),
                insta: booking.contacts.insta?.trim(),
            },
        });
    }
}

module.exports = new BookingService();
