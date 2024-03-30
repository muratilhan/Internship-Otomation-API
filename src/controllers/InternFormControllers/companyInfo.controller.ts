import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewCompany = async (req, res, next) => {
  try {
    const { name, address, phone, fax, email, service_area, internForm_id } =
      req.body;
    const newCompany = await prisma.companyInfo.create({
      data: {
        name: name,
        address: address,
        phone: phone,
        fax: fax,
        email: email,
        service_area: service_area,
        InternForm: {
          connect: {
            id: internForm_id,
          },
        },
      },
    });

    res.status(201).json({ message: newCompany });
  } catch (e) {
    next(e);
  }
};

export const updateSingleCompany = async (req, res, next) => {
  try {
    const { company_id } = req.body;

    const updated_company = await prisma.companyInfo.update({
      where: {
        id: company_id,
      },
      data: {
        name: req.name,
        address: req.address,
        phone: req.phone,
      },
    });

    res.status(201).json({ message: updated_company });
  } catch (e) {
    next(e);
  }
};

export const getSingleCompany = async (req, res, next) => {
  try {
    const { company_id } = req.body;

    const single_company = await prisma.companyInfo.findUnique({
      where: {
        id: company_id,
      },
    });

    res.status(201).json({ message: single_company });
  } catch (e) {
    next(e);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const allCompanies = await prisma.companyInfo.findMany();

    res.status(201).json({ message: allCompanies });
  } catch (e) {
    next(e);
  }
};

export const deleteSingleCompany = async (req, res, next) => {
  try {
    const company_id = req.body.company_id;
    console.log(company_id);
    await prisma.companyInfo.delete({
      where: {
        id: company_id,
      },
    });
    res.status(200).json({ message: "removed" });
  } catch (e) {
    next(e);
  }
};
