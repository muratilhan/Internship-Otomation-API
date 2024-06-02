import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthorizationError } from "../../errors/AuthorizationError";
import { BadRequestError } from "../../errors/BadRequestError";
import { isSealedQueryCheck } from "../../handlers/query.handler";

export const addCompanyInfo = async (req, res, next) => {
  try {
    const { internFormId, name, address, phone, fax, email, serviceArea } =
      req.body;

    await prisma.companyInfo.create({
      data: {
        InternForm: {
          connect: {
            id: internFormId,
          },
        },
        name: name,
        phone: phone,
        fax: fax,
        email: email,
        address: address,
        service_area: serviceArea,
      },
    });

    res.status(200).json({ message: "Company Info added succesfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyInfo = async (req, res, next) => {
  try {
    const userId = req.id;
    const userRole = req.roles;

    const companyInfoId = req.params.companyInfoId;

    const { internFormId, name, address, phone, fax, email, serviceArea } =
      req.body;

    const companyInfo = await prisma.companyInfo.findUnique({
      where: {
        id: companyInfoId,
      },
    });

    if (isSealedQueryCheck(userRole, companyInfo.isSealed)) {
      throw new AuthorizationError(errorCodes.NOT_PERMISSION);
    }

    await prisma.companyInfo.update({
      where: { id: companyInfoId },
      data: {
        InternForm: {
          connect: {
            id: internFormId,
          },
        },
        name: name,
        phone: phone,
        fax: fax,
        email: email,
        address: address,
        service_area: serviceArea,
      },
    });

    res.status(200).json({ message: "Company Info updated succesfully" });
  } catch (error) {
    next(error);
  }
};
